import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ReviewResponseFormProps {
  value: string
  onChange: (value: string) => void
  onCancel: () => void
  onSubmit: () => void
  isLoading: boolean
}

export function ReviewResponseForm({ value, onChange, onCancel, onSubmit, isLoading }: ReviewResponseFormProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="response">Your response</Label>
        <Textarea
          id="response"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your response to this review..."
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground">{value.length}/1000 characters</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit response'}
        </Button>
      </div>
    </div>
  )
}
