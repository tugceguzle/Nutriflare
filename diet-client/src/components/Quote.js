import React from 'react'
import { quote } from './ComponentsSvg'

export default function Quote({text , author}) {
  return (
    <>
      <section className="text-gray-600 body-font my-8">
        <div className="container px-5 py-2 mx-auto">
          <div className="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
            {quote}
            <p className="leading-relaxed text-lg">
              {text}
            </p>
            <span className="inline-block h-1 w-10 rounded bg-thorange mt-4 mb-2"></span>
            <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm">
              {author}
            </h2>
          </div>
        </div>
      </section>
    </>
  )
}
