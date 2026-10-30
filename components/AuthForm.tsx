'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { type ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import Link from "next/link";
import FileUpload from "./FileUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props<TInput extends FieldValues, TOutput extends FieldValues> {
    schema: ZodType<TOutput, TInput>;
    defaultValues: TInput;
    onSubmit: (data: TOutput) => Promise<{ success: boolean; error?: string }>
    type: 'SIGN_IN' | 'SIGN_UP'
}

const AuthForm = <TInput extends FieldValues, TOutput extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<TInput, TOutput>) => {
    const router = useRouter()
    const isSignIn = type === 'SIGN_IN'

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<TInput, unknown, TOutput>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<TInput>
    })

    const handleSubmit: SubmitHandler<TOutput> = async (data) => {
        setIsLoading(true)

        const result = await onSubmit(data);

        if (result.success) {
            setIsLoading(false)

            toast.success("Success", {
                description: isSignIn ? "You have successfully signed in" : "You have successfully signed up"
            })

            router.push('/');
        } else {
            setIsLoading(false)

            toast.error(`Error ${isSignIn ? "signing in" : "signing up"}`, {
                description: result.error ?? "An error occurred"
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn ? "Welcome back to Bookwise" : "Create your library account"}
            </h1>

            <p className="text-light-100">
                {isSignIn
                    ? "Access the vast collection of resources, and stay updated"
                    : "Please complete all fields and upload a valid university ID to gain access to the library"}
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
                    {Object.keys(defaultValues).map(field => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<TInput>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        {field.name === 'universityCard'
                                            ? <FileUpload
                                                type="image"
                                                accept="image/*"
                                                placeholder="Upload your ID"
                                                folder="ids"
                                                variant="dark"
                                                onFileChange={field.onChange}
                                            />
                                            : <Input required type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} className="form-input" {...field} />
                                        }

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="submit" disabled={isLoading} className="form-btn">
                        {isLoading ? "Signing " : "Sign "} {isSignIn ? "In" : "Up"}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-base font-medium">
                {isSignIn ? "New to Bookwise? " : "Already have an account? "}

                <Link
                    href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-primary"
                >
                    {isSignIn ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    )
}

export default AuthForm