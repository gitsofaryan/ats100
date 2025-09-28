import React, { useState, useRef } from 'react'
import ChatPanel from '~/components/ChatPanel'
import ResumePanel from '~/components/ResumePanel'
import { WarpBackground } from '~/components/ui/warp-background'


function Chat() {
    const [leftWidth, setLeftWidth] = useState(40)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = () => {
        setIsDragging(true)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return

        const containerRect = containerRef.current.getBoundingClientRect()
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
            setLeftWidth(newLeftWidth)
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    return (
        <div
            className='min-h-screen flex p-6 bg-gray-900 relative'
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <WarpBackground
                className="absolute inset-0 z-0"
            >
                <div />
            </WarpBackground>

            <div
                className="left border border-gray-600/50 rounded-2xl bg-gray-800/20 relative z-10"
                style={{ width: `${leftWidth}%` }}
            >
                <ChatPanel />
            </div>

            <div
                className="w-1 bg-gray-600/70 hover:bg-gray-500/80 cursor-col-resize relative z-10"
                onMouseDown={handleMouseDown}
            />

            <div
                className="right flex-1 relative z-10"
            >
                <ResumePanel />
            </div>
        </div>
    )
}

export default Chat
