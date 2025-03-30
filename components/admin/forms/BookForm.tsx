'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
    Form
} from "@/components/ui/form";
import { bookSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { createBook } from "@/lib/admin/actions/book";
import { toast } from "sonner";

interface Props extends Partial<Book> {
    type: 'create' | 'update'
}

const BookForm = ({ type, ...book }: Props) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            genre: "",
            rating: 1,
            totalCopies: 1,
            coverUrl: "",
            coverColor: "",
            videoUrl: "",
            summary: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        setIsLoading(true)

        const result = await createBook(values);

        if (result.success) {
            toast.success("Success", {
                description: "Book created successfully"
            })

            setIsLoading(false)
            router.push(`/admin/books/${result.data.id}`)
        } else {
            setIsLoading(false)
            toast.error('Error', {
                description: result.message
            })
        }

    }

    return (
        <div className="flex flex-col gap-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <CustomFormField control={form.control} name="title" label="Book Title" placeholder="Book Title" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name="author" label="Author" placeholder="Book author" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name="genre" label="Genre" placeholder="Book genre" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name="rating" label="Rating" placeholder="Book rating" fieldType={FormFieldType.NUMBER} min={1} max={5} />
                    <CustomFormField control={form.control} name="totalCopies" label="Total Copies" placeholder="Total copies" fieldType={FormFieldType.NUMBER} min={1} max={10000} />

                    <CustomFormField
                        control={form.control}
                        name="coverUrl"
                        label="Book Image"
                        fieldType={FormFieldType.FILE}
                        placeholder="Upload a book cover"
                        fileType="image"
                        folder="books/covers"
                        variant="light"
                    />
                    <CustomFormField control={form.control} name="coverColor" label="Primary Color" fieldType={FormFieldType.COLOR} />

                    <CustomFormField control={form.control} name="description" label="Book Description" placeholder="Book description" fieldType={FormFieldType.TEXTAREA} rows={10} />

                    <CustomFormField
                        control={form.control}
                        name="videoUrl"
                        label="Book Trailer"
                        fieldType={FormFieldType.FILE}
                        placeholder="Upload a book trailer"
                        fileType="video"
                        folder="books/videos"
                        variant="light"
                    />

                    <CustomFormField control={form.control} name="summary" label="Book Summary" placeholder="Book summary" fieldType={FormFieldType.TEXTAREA} rows={5} />

                    <Button type="submit" disabled={isLoading} className="book-form_btn text-white">
                        {isLoading ? "Hold On..." : "Add Book to Library"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default BookForm