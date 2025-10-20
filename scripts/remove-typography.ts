import { Project, SyntaxKind, Node, JsxAttribute, JsxSelfClosingElement, JsxOpeningElement } from 'ts-morph'

const typographyMapping: Record<string, { tag: string; defaultClass?: string }> = {
  H1: {
    tag: 'h1',
    defaultClass: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  },
  H2: {
    tag: 'h2',
    defaultClass: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  },
  H3: {
    tag: 'h3',
    defaultClass: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  },
  H4: {
    tag: 'h4',
    defaultClass: 'scroll-m-20 text-xl font-semibold tracking-tight',
  },
  H5: {
    tag: 'h5',
    defaultClass: 'scroll-m-20 text-lg font-semibold tracking-tight',
  },
  H6: {
    tag: 'h6',
    defaultClass: 'scroll-m-20 text-base font-semibold tracking-tight',
  },
  P: {
    tag: 'p',
    defaultClass: 'leading-7',
  },
  Lead: {
    tag: 'p',
    defaultClass: 'text-xl text-muted-foreground',
  },
  Large: {
    tag: 'span',
    defaultClass: 'text-lg font-semibold',
  },
  Small: {
    tag: 'small',
    defaultClass: 'text-sm font-medium leading-none',
  },
  Muted: {
    tag: 'p',
    defaultClass: 'text-sm text-muted-foreground',
  },
  Blockquote: {
    tag: 'blockquote',
    defaultClass: 'border-l-2 pl-6 italic',
  },
  Code: {
    tag: 'code',
    defaultClass: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  },
  InlineCode: {
    tag: 'code',
    defaultClass: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  },
  Kbd: {
    tag: 'kbd',
    defaultClass: 'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100',
  },
  Mark: {
    tag: 'mark',
    defaultClass: 'bg-yellow-200 dark:bg-yellow-900/50 px-1',
  },
  Strong: {
    tag: 'strong',
    defaultClass: 'font-bold',
  },
  Em: {
    tag: 'em',
    defaultClass: 'italic',
  },
}

const project = new Project({ tsConfigFilePath: 'tsconfig.json' })

const sourceFiles = project
  .getSourceFiles(['**/*.tsx', '**/*.ts'])
  .filter((sf) => !sf.getFilePath().includes('node_modules') && !sf.getFilePath().includes('.next'))

const updatedFiles: string[] = []

for (const sourceFile of sourceFiles) {
  const importDecl = sourceFile.getImportDeclaration('@/components/ui/typography')
  if (!importDecl) continue

  const namedImports = importDecl.getNamedImports()
  if (namedImports.length === 0) {
    importDecl.remove()
    continue
  }

  const replacements = new Map<string, { tag: string; defaultClass?: string }>()
  let hasUnmapped = false

  for (const spec of namedImports) {
    const importedName = spec.getName()
    const localName = spec.getAliasNode()?.getText() ?? importedName
    const mapping = typographyMapping[importedName]
    if (!mapping) {
      hasUnmapped = true
      continue
    }
    replacements.set(localName, mapping)
  }

  importDecl.remove()

  if (replacements.size === 0 && !hasUnmapped) {
    continue
  }

  let needsCnImport = false

  const ensureClassName = (element: JsxOpeningElement | JsxSelfClosingElement, defaultClass?: string) => {
    if (!defaultClass?.trim()) return

    const classAttr = element.getAttribute('className')

    if (!classAttr) {
      element.addAttribute({ name: 'className', initializer: `"${defaultClass}"` })
      return
    }

    if (!Node.isJsxAttribute(classAttr)) return

    const initializer = classAttr.getInitializer()

    if (!initializer) {
      classAttr.setInitializer(`"${defaultClass}"`)
      return
    }

    if (Node.isStringLiteral(initializer) || Node.isNoSubstitutionTemplateLiteral(initializer)) {
      const existing = initializer.getLiteralText()
      if (!existing.includes(defaultClass)) {
        const merged = `${defaultClass} ${existing}`.trim()
        classAttr.setInitializer(`"${merged}"`)
      }
      return
    }

    if (Node.isJsxExpression(initializer)) {
      const expr = initializer.getExpression()
      if (!expr) {
        classAttr.setInitializer(`"${defaultClass}"`)
        return
      }

      if (Node.isCallExpression(expr) && Node.isIdentifier(expr.getExpression()) && expr.getExpression().getText() === 'cn') {
        const hasDefaultAlready = expr
          .getArguments()
          .some((arg) => Node.isStringLiteral(arg) && arg.getLiteralText() === defaultClass)
        if (!hasDefaultAlready) {
          expr.insertArgument(0, `'${defaultClass}'`)
        }
        return
      }

      initializer.replaceWithText(`{cn('${defaultClass}', ${expr.getText()})}`)
      needsCnImport = true
      return
    }
  }

  const processOpeningElement = (element: JsxOpeningElement | JsxSelfClosingElement) => {
    const tagNameNode = element.getTagNameNode()
    const tagName = tagNameNode.getText()
    const mapping = replacements.get(tagName)
    if (!mapping) return

    tagNameNode.replaceWithText(mapping.tag)
    ensureClassName(element, mapping.defaultClass)
  }

  sourceFile.forEachDescendant((node) => {
    if (Node.isJsxSelfClosingElement(node)) {
      processOpeningElement(node)
    } else if (Node.isJsxOpeningElement(node)) {
      processOpeningElement(node)
    } else if (Node.isJsxClosingElement(node)) {
      const tagName = node.getTagNameNode().getText()
      const mapping = replacements.get(tagName)
      if (mapping) {
        node.getTagNameNode().replaceWithText(mapping.tag)
      }
    }
  })

  if (needsCnImport) {
    let utilsImport = sourceFile.getImportDeclaration('@/lib/utils')
    if (utilsImport) {
      const hasCn = utilsImport.getNamedImports().some((spec) => spec.getName() === 'cn')
      if (!hasCn) {
        utilsImport.addNamedImport('cn')
      }
    } else {
      sourceFile.insertImportDeclaration(0, {
        moduleSpecifier: '@/lib/utils',
        namedImports: ['cn'],
      })
    }
  }

  updatedFiles.push(sourceFile.getFilePath())
}

project.saveSync()

console.log(`Updated ${updatedFiles.length} files.`)
