# 01. Package Installation Rules

## 1.1 JavaScript/TypeScript Installation

### Rule 1.1.1: Use npm for JavaScript client library
```bash
npm install @supabase/supabase-js
```

### Rule 1.1.2: Always install the latest stable version
- Use `@latest` tag when necessary
- Check compatibility with your Node.js version

### Rule 1.1.3: Framework-specific installations
```bash
# React Native with additional dependencies
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

# React Native with encryption support
npm install @supabase/supabase-js aes-js react-native-get-random-values
npx expo install expo-secure-store
```

## 1.2 Other Language Clients

### Rule 1.2.1: Python client installation
```bash
pip install supabase
```

### Rule 1.2.2: Swift client installation via Swift Package Manager
```swift
.package(
    url: "https://github.com/supabase/supabase-swift.git", 
    from: "2.0.0"
)
```

### Rule 1.2.3: C# client installation via NuGet
```bash
dotnet add package supabase
```

### Rule 1.2.4: Flutter client installation
```bash
flutter pub add supabase_flutter google_sign_in
```

## 1.3 CDN Usage Rules

### Rule 1.3.1: UMD CDN for direct browser usage
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<!-- or -->
<script src="https://unpkg.com/@supabase/supabase-js"></script>
```

### Rule 1.3.2: ESM CDN for modern browsers
```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
</script>
```

## 1.4 Version Compatibility Rules

### Rule 1.4.1: Check Node.js compatibility
- Python: Requires 3.8+
- JavaScript: Follow package.json engines field

### Rule 1.4.2: Framework-specific requirements
- Next.js: Use appropriate template with `create-next-app`
- React Native: Ensure AsyncStorage compatibility
- Flutter: Verify Dart version compatibility