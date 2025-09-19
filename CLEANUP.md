# 🧹 Auditare Health - Code Cleanup & Maintainability Guide

> **Last Updated:** September 19, 2025  
> **Review Date:** Based on comprehensive codebase analysis

This document outlines areas for improvement in code cleanliness and maintainability for the Auditare Health risk assessment application.

## ✅ **COMPLETED CLEANUP** - September 19, 2025

### 🎯 **1. QuestionnaireForm Refactoring** - ✅ COMPLETE
- **Reduced size**: 427 lines → 97 lines (77% reduction)
- **Extracted 6 UI components**: ProgressIndicator, StickyProgressBar, QuestionCard, ErrorDisplay, SubmissionSection, AllQuestionsAnswered
- **Created 4 custom hooks**: useQuestionnaireData, useQuestionnaireForm, useFormValidation, useFormSubmission
- **Eliminated DOM manipulation**: Replaced with React state management
- **Added error boundaries**: ErrorBoundary component with user-friendly fallbacks
- **Improved separation of concerns**: Business logic → hooks, UI logic → components
- **Eliminated 5 duplicate action files**: submit-ascvd.ts, submit-findrisk.ts, submit-frax.ts, submit-gad7.ts, submit-start.ts
- **Created generic submission action**: submitQuestionnaireByType using scorer registry pattern
- **Integrated scorer registry**: Added scorer mapping to existing questionnaire-registry.ts
- **Updated all components**: All questionnaire forms now use the generic action
- **Maintained functionality**: Zero breaking changes, same user experience

### 🎯 **2. localStorage Hydration Issues** - ✅ COMPLETE
- **Created SSR-safe storage hook**: `useClientStorage` prevents hydration mismatches
- **Fixed UserProfileContext**: Eliminated direct localStorage access in useEffect
- **Added hydration awareness**: `isHydrated` state prevents premature localStorage operations
- **Improved error handling**: Graceful handling of localStorage errors and JSON parsing failures
- **Enhanced loading states**: Clear distinction between loading and hydration states
- **Maintained functionality**: Zero breaking changes, improved SSR compatibility
- **Type safety**: Added proper TypeScript support with extended UserProfileContextType

### 🎯 **3. Standardize Component Patterns** - ✅ COMPLETE
- **Created standardized utilities**: `questionnaire-metadata.ts` for consistent UI text and configuration
- **Created custom hook**: `useQuestionnaireSubmission` for consistent submission logic across all forms
- **Created base component**: `StandardQuestionnaireForm` that all questionnaire components inherit from
- **Updated all questionnaire components**: ASCVDForm, FINDRISKForm, FRAXForm, GAD7Form, STarTForm now use standardized pattern
- **Eliminated code duplication**: All forms use same submission logic, error handling, and UI configuration
- **Added comprehensive documentation**: Each component has JSDoc comments explaining purpose and usage
- **Improved maintainability**: Changes to submission logic or UI patterns now require updates in one place
- **Enhanced type safety**: Consistent prop interfaces and proper TypeScript support throughout
- **Maintained functionality**: Zero breaking changes, same user experience with improved consistency

### 🎯 **4. Dynamic Route Refactoring** - ✅ COMPLETE
- **Moved UI metadata to JSON files**: Each questionnaire now contains its UI configuration (submitButtonText, loadingText, description)
- **Created dynamic route**: `[questionnaireId]/page.tsx` handles all questionnaire types with a single file
- **Enhanced questionnaire registry**: Added `getQuestionnaireById()` function for dynamic loading
- **Eliminated file duplication**: Removed 5 individual questionnaire directories (ascvd/, findrisk/, frax/, gad7/, start/)
- **Reduced codebase**: From 25+ questionnaire-specific files to 1 dynamic route + registry
- **Added static generation**: `generateStaticParams()` pre-builds all questionnaire pages at build time
- **Added dynamic metadata**: `generateMetadata()` generates SEO-friendly titles and descriptions per questionnaire
- **Improved maintainability**: Adding new questionnaires requires only JSON file + registry entry
- **Enhanced type safety**: Full TypeScript support with Next.js 15 async params pattern
- **Maintained functionality**: All URLs (/ascvd, /findrisk, etc.) work exactly the same


## 📊 Current State Assessment

### ✅ Strengths
- **Solid Architecture:** Clear separation between frontend (Next.js) and backend (Payload CMS)
- **TypeScript Usage:** Comprehensive TypeScript implementation throughout
- **Component Organization:** Logical grouping and clear file structure
- **Consistent Naming:** Good file and component naming conventions
- **Modern Stack:** Next.js 15, Payload CMS 3.x, Tailwind CSS, shadcn/ui

### ⚠️ Areas Needing Attention
- ~~Code duplication in questionnaire actions~~ ✅ **COMPLETED**
- ~~Large, monolithic components~~ ✅ **COMPLETED**
- ~~Inconsistent state management patterns~~ ✅ **COMPLETED** 
- ~~Missing error boundaries and proper error handling~~ ✅ **COMPLETED**
- ~~localStorage hydration issues~~ ✅ **COMPLETED**

---

## 🎯 Priority-Based Improvement Plan

## 🔴 **HIGH PRIORITY** - Technical Debt

### 1. **Refactor Large Components**

#### Problem: `QuestionnaireForm.tsx` (427 lines)
- **Location:** `src/components/questionnaire/QuestionnaireForm.tsx`
- **Issues:**
  - Multiple responsibilities (form state, progress, UI, validation)
  - Direct DOM manipulation for sticky progress
  - Complex state dependencies causing unnecessary re-renders

#### Solution:
```typescript
// Suggested component breakdown:
src/components/questionnaire/
├── QuestionnaireForm.tsx          // Orchestration only
├── ProgressIndicator.tsx          // Progress tracking
├── StickyProgressBar.tsx          // Sticky progress UI
├── QuestionCard.tsx               // Individual question rendering
├── SubmissionSection.tsx          // Submit button and validation
└── ErrorDisplay.tsx               // Error state handling
```

#### Implementation Steps:
1. Extract `ProgressIndicator` component
2. Create `QuestionCard` for individual questions
3. Move submission logic to `SubmissionSection`
4. Replace DOM manipulation with React state
5. Add proper error boundaries

---

### 2. **Eliminate Questionnaire Action Duplication**

#### Problem: Duplicate Action Files
- **Locations:** 
  - `src/app/(frontend)/(questionnaires)/*/actions/submit-*.ts`
- **Issue:** Each questionnaire has nearly identical action files

#### Current Pattern:
```typescript
// submit-ascvd.ts, submit-findrisk.ts, etc.
export async function submitASCVDQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: ASCVDScorer, // Only difference
  })
}
```

#### Solution: Scorer Registry Pattern
```typescript
// src/lib/utils/scorer-registry.ts
export const scorerRegistry = new Map([
  ['ascvd', ASCVDScorer],
  ['findrisk', FINDRISKScorer],
  ['frax', FRAXScorer],
  ['gad7', GAD7Scorer],
  ['start', STarTScorer],
])

// src/lib/actions/submit-questionnaire-by-type.ts
export async function submitQuestionnaireByType(
  questionnaireType: string,
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  const ScorerClass = scorerRegistry.get(questionnaireType)
  if (!ScorerClass) {
    throw new Error(`Unknown questionnaire type: ${questionnaireType}`)
  }
  
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: ScorerClass,
  })
}
```

#### Implementation Steps:
1. Create scorer registry
2. Create generic submission action
3. Update questionnaire components to use generic action
4. Remove duplicate action files

---

### 3. **Fix State Management Issues**

#### Problem: localStorage Hydration Issues
- **Location:** `src/contexts/UserProfileContext.tsx`
- **Issue:** Direct localStorage access causing potential hydration mismatches

#### Current Code:
```typescript
// Potential hydration issue
useEffect(() => {
  const stored = localStorage.getItem('userProfile')
  // ...
}, [])
```

#### Solution: SSR-Safe Storage
```typescript
// src/hooks/useClientStorage.ts
export function useClientStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setValue(JSON.parse(stored))
      } catch (error) {
        console.error(`Error parsing stored ${key}:`, error)
        localStorage.removeItem(key)
      }
    }
  }, [key])

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue)
    if (isHydrated) {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, [key, isHydrated])

  return [value, setStoredValue, isHydrated] as const
}
```

#### Implementation Steps:
1. Create SSR-safe storage hook
2. Update `UserProfileContext` to use the hook
3. Add loading states for hydration
4. Test SSR compatibility

---

## 🟡 **MEDIUM PRIORITY** - Code Quality

### 4. **Enhance Type Safety**

#### Problem: Unsafe Type Assertions
- **Location:** `src/lib/scorers/ASCVDScorer.ts` and others
- **Issue:** Type assertions without runtime validation

#### Current Code:
```typescript
sex: this.getAnswerValue('sex') as 'male' | 'female',
```

#### Solution: Runtime Validation
```typescript
// src/lib/utils/type-guards.ts
export function assertSex(value: string): asserts value is 'male' | 'female' {
  if (value !== 'male' && value !== 'female') {
    throw new Error(`Invalid sex value: ${value}. Expected 'male' or 'female'`)
  }
}

// In scorer:
const sexValue = this.getAnswerValue('sex')
assertSex(sexValue)
const sex = sexValue // Now properly typed
```

#### Implementation Steps:
1. Create type guard utilities
2. Replace type assertions with validated assertions
3. Add proper error handling for validation failures
4. Add unit tests for type guards

---

### 5. **Standardize Component Patterns** - ✅ COMPLETE

#### Problem: Inconsistent Component Structure
- **Issue:** Some questionnaire components are thin wrappers, others contain logic

#### Solution: Consistent Component Pattern ✅ IMPLEMENTED
- **Created standardized utilities**: `questionnaire-metadata.ts` for consistent UI text and configuration
- **Created custom hook**: `useQuestionnaireSubmission` for consistent submission logic
- **Created base component**: `StandardQuestionnaireForm` that all questionnaire components use
- **Updated all questionnaire components**: All now use the standardized pattern with consistent props
- **Eliminated code duplication**: All forms now use the same submission logic and UI configuration
- **Added proper documentation**: Each component has JSDoc comments explaining its purpose
- **Maintained functionality**: Zero breaking changes, improved consistency

#### Final Implementation:
```typescript
// All questionnaire components now follow this pattern:
export function QuestionnaireForm({ questionnaire }: QuestionnaireFormProps) {
  return <StandardQuestionnaireForm questionnaire={questionnaire} />
}

// StandardQuestionnaireForm handles:
// - User profile validation
// - Questionnaire submission logic  
// - Loading states and error handling
// - Consistent UI text from metadata registry
// - Proper TypeScript typing
```

---

### 6. **Improve Error Handling**

#### Problem: Missing Error Boundaries
- **Issue:** No component-level error handling

#### Solution: Error Boundary Implementation
```typescript
// src/components/common/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
```

---

## 🟢 **LOW PRIORITY** - Nice to Have

### 7. **Performance Optimizations**

#### Bundle Size Optimization
```typescript
// Dynamic imports for questionnaire data
const loadQuestionnaireData = async (type: string) => {
  switch (type) {
    case 'ascvd':
      return import('@/lib/data/questionnaires/ascvd.json')
    case 'findrisk':
      return import('@/lib/data/questionnaires/findrisk.json')
    // ... etc
  }
}
```

#### Component Memoization
```typescript
// Memoize expensive components
export const QuestionCard = memo(({ question, value, onChange }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.question.id === nextProps.question.id &&
         prevProps.value === nextProps.value
})
```

---

### 8. **Accessibility Improvements**

#### ARIA Labels and Keyboard Navigation
```typescript
// Enhanced form controls
<ToggleGroupItem
  key={option.value}
  value={option.value}
  className="..."
  aria-label={`Select ${option.label}`}
  role="radio"
  aria-checked={formData.answers[question.id] === option.value}
>
  {option.label}
</ToggleGroupItem>
```

#### Screen Reader Support
```typescript
// Add live regions for dynamic content
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {`Question ${currentQuestion} of ${totalQuestions} completed`}
</div>
```

---

### 9. **Documentation & Testing**

#### Component Documentation
```typescript
/**
 * QuestionnaireForm handles the rendering and submission of health risk questionnaires.
 * 
 * Features:
 * - Auto-fills answers from user profile when available
 * - Provides real-time progress tracking
 * - Validates required fields before submission
 * - Supports accessibility features
 * 
 * @param questionnaire - The questionnaire schema to render
 * @param onSubmit - Callback function for form submission
 * @param submitButtonText - Custom text for submit button
 * @param loadingText - Custom text for loading state
 */
export function QuestionnaireForm({ ... }: QuestionnaireFormProps) {
  // Implementation
}
```

#### Integration Tests
```typescript
// src/tests/integration/questionnaire-flow.test.tsx
describe('Questionnaire Flow', () => {
  it('should complete ASCVD questionnaire with profile data', async () => {
    // Test implementation
  })
})
```

---

## 🗂️ **File Structure Improvements**

### Suggested Reorganization

```
src/
├── components/
│   ├── common/                    # Shared components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Layout.tsx
│   ├── forms/                     # Form-specific components
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── ValidationError.tsx
│   └── questionnaire/             # Questionnaire components
│       ├── QuestionnaireContainer.tsx
│       ├── QuestionnaireForm.tsx
│       └── QuestionnaireResults.tsx
├── hooks/                         # Custom hooks
│   ├── useClientStorage.ts
│   ├── useFormValidation.ts
│   └── useQuestionnaire.ts
├── lib/
│   ├── types/                     # Type definitions
│   ├── utils/                     # Utilities
│   │   ├── type-guards.ts
│   │   ├── scorer-registry.ts
│   │   └── validation.ts
│   └── constants/                 # App constants
│       └── questionnaire-types.ts
└── tests/
    ├── unit/                      # Unit tests
    ├── integration/               # Integration tests
    └── helpers/                   # Test utilities
```

---

## 📋 **Implementation Checklist**

### Phase 1: Critical Issues (Week 1-2)
- [x] Extract components from `QuestionnaireForm.tsx` ✅ **COMPLETED**
- [x] Extract business logic into custom hooks ✅ **COMPLETED** 
- [x] Add error boundaries to main components ✅ **COMPLETED**
- [x] Implement scorer registry pattern ✅ **COMPLETED**
- [x] Fix localStorage hydration issues ✅ **COMPLETED**

### Phase 2: Code Quality (Week 3-4)
- [ ] Add runtime type validation
- [x] Standardize component patterns ✅ **COMPLETED**
- [x] Refactor duplicate questionnaire routes ✅ **COMPLETED**
- [ ] Improve error handling throughout app
- [ ] Add component documentation

### Phase 3: Polish & Performance (Week 5-6)
- [ ] Implement performance optimizations
- [ ] Add accessibility improvements
- [ ] Write integration tests
- [ ] Update file structure organization

---

## 🔧 **Development Guidelines**

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use proper error boundaries
- Document complex logic with comments
- Follow consistent naming conventions

### Component Design
- Single Responsibility Principle
- Compose larger components from smaller ones
- Use proper prop typing
- Implement proper error states
- Consider accessibility from the start

### State Management
- Use appropriate React hooks
- Avoid prop drilling with context
- Handle loading and error states
- Implement proper cleanup in useEffect

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for user flows
- E2E tests for critical paths
- Test error scenarios

---

## 📞 **Need Help?**

When implementing these changes:

1. **Start Small:** Begin with high-priority items
2. **Test Thoroughly:** Each change should be tested
3. **Document Changes:** Update this file as you progress
4. **Review Regularly:** Schedule periodic code reviews

Remember: **Clean code is not written by following a set of rules. Clean code is written by programmers who care about their craft.**

---

*This document should be reviewed and updated quarterly or after major feature additions.*
