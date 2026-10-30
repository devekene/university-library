"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReactNode, useState } from "react";
import { Control, ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import FileUpload from "./FileUpload";
import ColorPicker from "./admin/ColorPicker";

export enum FormFieldType {
    INPUT = "input",
    NUMBER = "number",
    TEXTAREA = "textarea",
    PASSWORD = "password",
    FILE = "file",
    COLOR = 'color'
}

interface CustomFormFieldProps<TInput extends FieldValues, TOutput> {
    control: Control<TInput, unknown, TOutput>;
    fieldType: FormFieldType;
    name: FieldPath<TInput>;
    label: string;
    placeholder?: string;
    className?: string;
    // Number Input
    min?: number;
    max?: number;
    // Textarea Input
    rows?: number;
    // File
    fileType?: 'image' | 'video'
    variant?: 'light' | 'dark'
    folder?: string
    children?: ReactNode;
}

const RenderField = <TInput extends FieldValues, TOutput>({
    field,
    props
}: {
    field: ControllerRenderProps<TInput, FieldPath<TInput>>;
    props: CustomFormFieldProps<TInput, TOutput>
}) => {
    const {
        fieldType,
        placeholder,
        fileType
    } = props;

    const [passwordVisible, setPasswordVisible] = useState(false);

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...field}
                        className="book-form_input"
                    />
                </FormControl>
            );

        case FormFieldType.NUMBER:
            return (
                <FormControl>
                    <Input
                        type="number"
                        min={props.min}
                        max={props.max}
                        placeholder={placeholder}
                        {...field}
                        className="book-form_input"
                    />
                </FormControl>
            );

        case FormFieldType.PASSWORD:
            return (
                <FormControl className="w-full">
                    <div className="relative flex">
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className="book-form_input"
                            type={passwordVisible ? "text" : "password"}
                        />

                        {passwordVisible ? (
                            <EyeOff
                                className="absolute right-2 cursor-pointer translate-y-1/2 text-base text-gray-600"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                role="img"
                                aria-label="hidden-password"
                            />
                        ) : (
                            <Eye
                                className="absolute right-2 translate-y-1/2 cursor-pointer text-base text-gray-600"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                role="img"
                                aria-label="visible-password"
                            />
                        )}
                    </div>
                </FormControl>
            );

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="book-form_input"
                        rows={props.rows}
                    />
                </FormControl>
            );

        case FormFieldType.FILE:
            return (
                <FormControl>
                    <FileUpload
                        type={fileType || 'image'}
                        accept={fileType === 'image' ? "image/*" : "video/*"}
                        placeholder={placeholder!}
                        folder={props.folder || ''}
                        variant={props.variant!}
                        onFileChange={field.onChange}
                        value={field.value}
                    />
                </FormControl>
            );

        case FormFieldType.COLOR:
            return (
                <FormControl>
                    <ColorPicker value={field.value} onPickerChange={field.onChange} />
                </FormControl>
            );
        default:
            break;
    }
};

const CustomFormField = <TInput extends FieldValues, TOutput>(props: CustomFormFieldProps<TInput, TOutput>) => {
    const { control, name, label } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-base font-normal text-dark-500">{label}</FormLabel>

                    <RenderField field={field} props={props} />

                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    );
};

export default CustomFormField;