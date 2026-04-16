"use client";

import { NewChatData, newChatSchema } from "@/src/lib/schemas/chatSchema";
import { useChatStore } from "@/src/stores/chatStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChat } from "@/src/lib/requests";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/src/components/ui/drawer";
import { Field, FieldError, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";

const NewChat = () => {
  const { chats, setChat, setChats, showNewChat, setShowNewChat } =
    useChatStore();

  const form = useForm<NewChatData>({
    resolver: zodResolver(newChatSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: NewChatData) => {
    const response = await createChat(values);

    if (response.data) {
      setChats(
        chats
          ? [response.data.chat, ...chats.filter((chat) => chat.id !== response.data?.chat.id)]
          : [response.data.chat],
      );
      setChat(response.data.chat);
      setShowNewChat(false);
      form.reset();
      return;
    }

    toast.error(response.error.message, { position: "top-center" });
  };

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <Drawer open={showNewChat} onOpenChange={setShowNewChat}>
      <DrawerContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleFormSubmit(event);
          }}
          className="mx-auto w-full max-w-lg"
        >
          <DrawerHeader>
            <DrawerTitle>New Chat</DrawerTitle>
            <DrawerDescription>
              Enter the user&apos;s email address to start a new conversation.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-chat-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="new-chat-email"
                    type="email"
                    placeholder="johndoe@email.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <DrawerFooter className="mt-8">
            <Button type="submit">Send</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default NewChat;
