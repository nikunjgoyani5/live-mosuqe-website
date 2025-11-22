"use client";

import { ReactNode } from "react";
import {
  FormProvider as RHFProvider,
  useForm,
  UseFormProps,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";

/**
 * Generic form wrapper.
 * Pass any react-hook-form options (defaultValues, resolver, etc.)
 * and an onSubmit handler.
 */
type Props<TFormValues extends FieldValues> = {
  children: ReactNode;
  onSubmit: SubmitHandler<TFormValues>;
  options?: UseFormProps<TFormValues>;
};

export default function FormProvider<
  TFormValues extends FieldValues = Record<string, string | object | unknown>
>({ children, onSubmit, options }: Props<TFormValues>) {
  const methods = useForm<TFormValues>({
    mode: "onChange",
    ...options, // allow passing resolver, defaultValues etc.
  });

  return (
    <RHFProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        {children}
      </form>
    </RHFProvider>
  );
}
