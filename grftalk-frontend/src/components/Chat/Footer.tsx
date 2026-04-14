"use client";

import { useTheme } from "next-themes";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { Laugh, Mic, Paperclip, SendHorizonal, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import BounceLoader from "react-spinners/BounceLoader";
import { Input } from "../ui/input";

type Props = {
  onSendMessage: (data: {
    text?: string;
    attachment?: File | null;
    audio?: Blob | null;
  }) => void;
};

const Footer = ({ onSendMessage }: Props) => {
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChuncks, setAudioChunks] = useState<Blob[]>([]);
  const [messageValue, setMessageValue] = useState("");
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null);

  const { theme, resolvedTheme } = useTheme();

  const pickerTheme =
    (resolvedTheme ?? theme) === "dark" ? Theme.DARK : Theme.LIGHT;

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleToggleEmojiPicker = () => setEmojiPicker(!emojiPicker);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setMessageValue((current) => `${current} ${emojiData.emoji}`.trim());
  };

  const handleUploadAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) setMessageAttachment(file);
  };

  const handleStartRecording = async () => {
    let stream: MediaStream | null = null;

    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        stream = streamData;
      } catch {
        toast.error("Enable microphone permissions.", {
          position: "top-center",
        });
        return;
      }
    } else {
      toast.error(`Your browser does not support audio recordings.`, {
        position: "top-center",
      });
      return;
    }

    if (!stream) return;

    setIsRecording(true);

    const media = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined" || event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const handleSendRecording = () => {
    if (!mediaRecorder.current) return;

    setIsRecording(false);

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChuncks, { type: "audio/webm" });

      onSendMessage({ audio: audioBlob });
      setAudioChunks([]);
    };
    mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
  };

  const handleDeleterecording = () => {
    if (!mediaRecorder.current) return;

    setIsRecording(false);
    mediaRecorder.current.stop();
    mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
  };

  const handleSendMessage = () => {
    onSendMessage({ text: messageValue, attachment: messageAttachment });

    setMessageAttachment(null);
    setMessageValue("");
  };

  return (
    <div>
      <div
        className={`fixed ml-2 ${emojiPicker ? "opacity-100 bottom-16" : "-bottom-110 opacity-0"} duration-30`}
      >
        <EmojiPicker theme={pickerTheme} onEmojiClick={handleEmojiSelect} />
      </div>

      {messageAttachment && (
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 bg-slate-100/80 opacity-80 dark:bg-slate-900/80 px-10 py-2 border-t">
          <p className="text-xs">
            File uploaded: {messageAttachment.name} | {messageAttachment.type}
          </p>

          <X
            onClick={() => setMessageAttachment(null)}
            className="size-4 hover:text-primary cursor-pointer"
          />
        </div>
      )}

      <div className="flex items-center gap-4 border-t bg-slate-100/80 dark:bg-slate-900/80 px-8 py-2.5">
        {isRecording ? (
          <div className="flex items-center gap-5">
            {" "}
            {/*attention*/}
            <Button
              variant="ghost"
              size="icon"
              title="Stop Recording"
              onClick={handleDeleterecording}
            >
              <Trash className="size-5 text-slate-500 dark:text-slate-300" />
            </Button>
            <div className="text-sm text-slate-500 dark:text-slate-300 flex items-center gap-2">
              <BounceLoader color="#f13434b3" size={17} />
              Recording in progress...
            </div>
            <Button
              className="ml-6"
              size="sm"
              title="Send Voice Message"
              onClick={handleSendRecording}
            >
              <SendHorizonal className="text-slate-100" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                title="Emoji"
                onClick={handleToggleEmojiPicker}
              >
                <Laugh className="text-slate-500 dark:text-slate-300" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Attachment"
                onClick={() => document.getElementById("attachment")?.click()}
              >
                <Paperclip className="text-slate-500 dark:text-slate-300" />
              </Button>

              <Input
                id="attachment"
                type="file"
                onChange={handleUploadAttachment}
              />
            </div>

            <div className="flex-1">
              <Input
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                placeholder="Type a message"
              />
            </div>

            <div>
              {!messageValue && !messageAttachment ? (
                <Button
                  size="icon"
                  title="Record voice message"
                  onClick={handleStartRecording}
                >
                  <Mic className="text-slate-100" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  title="Send a message"
                  onClick={handleSendMessage}
                >
                  <SendHorizonal className="text-slate-100" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Footer;
