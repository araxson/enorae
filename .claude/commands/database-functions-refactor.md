ULTRATHINK to refactor and optimize database functions and triggers using Context7 MCP for Supabase documentation and Supabase MCP for all operations. Keep token usage under 20000 by using pagination and filtering.

## Objective
Analyze and refactor database functions and triggers to improve maintainability, performance, and reliability through better organization, error handling, and design patterns.

**Note:** No need to worry about backward compatibility or existing application code - the application has not been built yet.

## Phase 1: Documentation Research
Use Context7 MCP to fetch latest Supabase documentation on:
- SQL function best practices
- PL/pgSQL optimization techniques
- Function performance patterns
- Trigger design best practices
- Error handling in functions
- Transaction management
- Function return type optimization
- Function volatility categories
- Function inlining opportunities

## Phase 2: Function Analysis
Use Supabase MCP to identify issues:

### Complexity Issues:
- Functions exceeding reasonable size thresholds
- Functions with multiple responsibilities
- Deeply nested logic requiring simplification
- Functions lacking clear single purpose
- Complex conditional logic needing refactoring

### Error Handling Issues:
- Functions without proper exception handling
- Missing validation of input parameters
- Inadequate error messages
- No logging for debugging
- Silent failures without reporting

### Performance Issues:
- Inefficient query patterns within functions
- Missing appropriate indexes for function queries
- Unnecessary data processing
- Suboptimal algorithm implementations
- Functions that could use set-based operations instead of loops

### Type and Return Issues:
- Missing or incorrect return type specifications
- Functions returning inappropriate types
- Missing IMMUTABLE/STABLE/VOLATILE classifications
- Incorrect function volatility affecting optimization

### Trigger Issues:
- Triggers with cascading side effects
- Multiple triggers where one would suffice
- Triggers performing expensive operations
- Missing trigger timing optimization
- Trigger logic that could be constraints

### Code Reusability:
- Duplicated logic across multiple functions
- Functions that should be utility functions
- Missing abstraction opportunities
- Hardcoded values that should be parameters
- Common patterns not extracted

## Phase 3: Refactoring Implementation
Use Supabase MCP to implement improvements:

### Break Down Complex Functions:
1. Extract distinct responsibilities into separate functions
2. Create utility functions for common operations
3. Limit function size to maintainable lengths
4. Implement single responsibility per function
5. Document each function purpose clearly

### Improve Error Handling:
1. Add comprehensive exception handling blocks
2. Implement input parameter validation
3. Provide clear, actionable error messages
4. Add appropriate logging for troubleshooting
5. Handle NULL cases explicitly
6. Use appropriate exception types

### Optimize Performance:
1. Replace cursor loops with set-based operations
2. Optimize query patterns within functions
3. Add necessary indexes for function queries
4. Minimize redundant computations
5. Use appropriate function volatility markers
6. Consider function inlining opportunities

### Correct Type Specifications:
1. Specify accurate return types
2. Use appropriate parameter types
3. Mark functions with correct volatility (IMMUTABLE/STABLE/VOLATILE)
4. Use RETURNS TABLE for set-returning functions
5. Implement proper type casting

### Refactor Triggers:
1. Combine related trigger logic where appropriate
2. Optimize trigger timing (BEFORE vs AFTER)
3. Move validation to constraints where possible
4. Reduce trigger complexity
5. Document trigger purposes and interactions
6. Test trigger cascading effects

### Improve Reusability:
1. Extract common logic into utility functions
2. Parameterize hardcoded values
3. Create function libraries for common operations
4. Use function overloading appropriately
5. Implement consistent function signatures

### Add Documentation:
1. Add COMMENT ON FUNCTION for all functions
2. Document parameters and return values
3. Explain function purpose and usage
4. Note any side effects or dependencies
5. Include usage recommendations

## Phase 4: Testing and Validation
Use Supabase MCP to verify:
- All refactored functions work correctly
- Error handling behaves as expected
- Performance improvements are measurable
- Trigger logic executes properly
- No regressions introduced
- Return types are correct
- Transaction handling is proper

## Phase 5: Documentation
Generate refactoring report:
- Functions refactored (count and complexity reduction)
- Utility functions created (count)
- Error handling improvements (count)
- Performance optimizations (metrics)
- Triggers optimized (count)
- Code reusability improvements (metrics)
- Documentation added (coverage percentage)
- Recommendations for ongoing maintenance

## Guidelines:
- Maintain single responsibility per function
- Implement comprehensive error handling
- Use set-based operations over loops when possible
- Document all functions with purpose and usage
- Test functions thoroughly after refactoring
- Mark function volatility correctly
- Validate all input parameters
- Use transactions appropriately
- Keep functions focused and concise
- Extract common logic to utilities
- Prefer constraints over trigger validation
- Optimize trigger timing and logic
- Version control function changes
- Test edge cases and error conditions
- Monitor function performance after changes