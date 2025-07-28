import clsx from "clsx";
import { type PanInfo } from "motion";
import { motion } from "motion/react"
import { PropsWithChildren, useRef } from "react";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function BottomSheet(props: PropsWithChildren<Props>) {
    const rightKnobRef = useRef<HTMLDivElement>(null);
    const leftKnobRef = useRef<HTMLDivElement>(null);

    const onDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (rightKnobRef.current && leftKnobRef.current) {
            if (info.velocity.y > 0) {
                rightKnobRef.current.style.transform = "rotate(12deg)";
                leftKnobRef.current.style.transform = "rotate(-12deg)";
            } else if (info.velocity.y < 0) {
                rightKnobRef.current.style.transform = "rotate(-12deg)";
                leftKnobRef.current.style.transform = "rotate(12deg)";
            }
        }
    };

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (rightKnobRef.current && leftKnobRef.current) {
            rightKnobRef.current.style.transform = "rotate(0)";
            leftKnobRef.current.style.transform = "rotate(0)";
        }

        if (info.offset.y > 100) {
            props.onClose();
        }
    };


    return (
        <>
            {props.isOpen && (
                <div className="fixed inset-0 w-dvw h-dvh flex justify-center items-center z-50">
                    <motion.div
                        className={clsx("w-full h-full inset-0 backdrop-blur-sm bg-black-12 z-[60] flex flex-col justify-end md:flex-row md:items-center md:justify-center")}
                        onClick={props.onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.dialog
                        open={props.isOpen}
                        className={clsx("fixed bottom-0 md:bottom-auto md:p-0 bg-transparent z-[70] mx-auto max-h-dvh md:shadow-2xl rounded-2xl md:max-w-[36rem] w-full")}
                        drag={window.screen.width < 768 && "y"}
                        dragConstraints={{ top: 0 }}
                        dragSnapToOrigin
                        dragElastic={0.01}
                        onDragEnd={onDragEnd}
                        onDrag={onDrag}
                        initial={window.screen.width < 768 ? { y: "100%" } : { opacity: 0 }}
                        animate={window.screen.width < 768 ? { y: 0 } : { opacity: 1 }}
                        exit={window.screen.width < 768 ? { y: "100%" } : { opacity: 0 }}
                        transition={{ ease: "easeOut" }}
                    >
                        <div className="flex flex-col justify-center items-center md:hidden  py-4 px-4 bg-background-primary rounded-t-2xl">
                            <div className="flex items-center justify-center w-full">
                                <div ref={leftKnobRef} className="bg-gray-200 w-4 h-1 rounded -m-[1px] right-knob" style={{ transition: "transform ease-in-out 0.1s" }} />
                                <div ref={rightKnobRef} className="bg-gray-200 w-4 h-1 rounded -m-[1px] left-knob" style={{ transition: "transform ease-in-out 0.1s" }} />
                            </div>

                            <div className="text-subtitle2 text-start w-full pt-4">
                                {props.title}
                            </div>
                        </div>

                        <div className="hidden md:flex items-center justify-between gap-2 py-3 px-4 bg-primary rounded-t-2xl">
                            <div className="text-subtitle2 py-1">
                                {props.title}
                            </div>

                            {/* <Image src={images.icon.close.src} alt={images.icon.close.alt} width={24} height={24} onClick={props.onClose} className="cursor-pointer" /> */}
                        </div>

                        {props.children}
                    </motion.dialog>
                </div>
            )}
        </>
    );
}