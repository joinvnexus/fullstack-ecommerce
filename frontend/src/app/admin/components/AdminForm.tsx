'use client';

import React from 'react';
import { useForm, Controller, FieldValues, Path } from 'react-hook-form';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ErrorMessage from '@/app/components/ui/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface FormField<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: any;
  disabled?: boolean;
}

interface AdminFormProps<T extends FieldValues> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  loading?: boolean;
  submitLabel?: string;
  className?: string;
}

export function AdminForm<T extends FieldValues>({
  fields,
  onSubmit,
  defaultValues,
  loading = false,
  submitLabel = 'Submit',
  className = '',
}: AdminFormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues: defaultValues as any,
  });

  const onFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={`space-y-6 ${className}`}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          <Controller
            name={field.name}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false,
              ...field.validation,
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              if (field.type === 'textarea') {
                return (
                  <Textarea
                    id={field.name}
                    ref={ref}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={field.placeholder}
                    disabled={field.disabled || loading}
                    rows={4}
                  />
                );
              }

              if (field.type === 'select') {
                return (
                  <Select
                    value={value || ''}
                    onValueChange={onChange}
                    disabled={field.disabled || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }

              if (field.type === 'checkbox') {
                return (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={field.name}
                      ref={ref}
                      checked={value || false}
                      onCheckedChange={onChange}
                      disabled={field.disabled || loading}
                    />
                    <Label htmlFor={field.name}>
                      {field.label}
                    </Label>
                  </div>
                );
              }

              return (
                <Input
                  id={field.name}
                  ref={ref}
                  type={field.type}
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={field.placeholder}
                  disabled={field.disabled || loading}
                />
              );
            }}
          />

          {errors[field.name] && (
            <ErrorMessage message={errors[field.name]?.message as string} />
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}