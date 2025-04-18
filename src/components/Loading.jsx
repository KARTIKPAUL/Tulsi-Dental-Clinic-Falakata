import React from 'react'

const Loading = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center mt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        </div>
    )
}

export default Loading
