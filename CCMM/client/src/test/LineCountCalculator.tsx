import { useState, FC } from "react"
import axios from "axios"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import jsPDF from "jspdf"

interface LineCounts {
    codeLines: number
    commentLines: number
    blankLines: number
}

const LineCountCalculator: FC = () => {
    const [code, setCode] = useState<string>("")
    const [lineCounts, setLineCounts] = useState<LineCounts | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [visibility, setVisibility] = useState<string>("hidden")

    const handleGeneratePdf = (): void => {
        const doc: jsPDF = new jsPDF()
        let y: number = 20 // Initial y position

        // Add heading
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold")
        doc.text("Code line count", 105, y, {
            align: "center",
        })

        y += 10

        doc.setFontSize(10)
        doc.setTextColor(0, 0, 255)
        doc.text(code, 10, y)

        // Start a new page
        doc.addPage()

        // Bold the text
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(14)
        if (lineCounts) {
            doc.text(`Code Lines: ${lineCounts.codeLines}`, 10, y + 10)
        }

        y += 10
        doc.setFontSize(14)
        if (lineCounts) {
            doc.text(`Blank Lines: ${lineCounts.blankLines}`, 10, y + 10)
        }

        y += 10
        doc.setFontSize(14)
        if (lineCounts) {
            doc.text(`Comment Lines: ${lineCounts.commentLines}`, 10, y + 10)
        }

        doc.save("Line_Count.pdf")
    }

    const handleCalculate = (): void => {
        setIsLoading(true)
        setError(null)

        axios
            .post("http://localhost:8080/calculate-line-count", { code })
            .then((response) => {
                setLineCounts(response.data)
            })
            .catch((error) => {
                setError(
                    "Error calculating line counts. Please check your input and try again.",
                )
                console.error("Error calculating line counts:", error)
            })
            .finally(() => {
                setIsLoading(false)
            })
        if (lineCounts !== null) {
            setVisibility("visible")
        }
    }

    const handleClear = (): void => {
        setCode("")
        setLineCounts(null)
        setError(null)
        setVisibility("hidden")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-800">
            <div className="w-full max-w-2xl rounded-lg bg-gray-900 p-6 shadow-md">
                <div className="CCMTcontainer">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <h1 className="mb-6 text-center text-2xl font-bold">
                    Line Count Calculator
                </h1>
                <div className="relative w-[32rem]">
                    <div className="relative w-full min-w-[200px]">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={8}
                            spellCheck="false"
                            className="border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full min-h-[100px] w-full !resize-none rounded-[7px] border border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-white focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0"
                            placeholder=" "
                        ></textarea>
                        <label className="before:content[' '] after:content[' '] text-blue-gray-400 before:border-blue-gray-200 after:border-blue-gray-200 peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-white peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-white peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent">
                            Enter your code here
                        </label>
                    </div>
                    <div className="flex w-full justify-between py-1.5">
                        <div className="flex gap-2">
                            <button
                                onClick={handleClear}
                                className="select-none rounded-md px-4 py-2 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleCalculate}
                                disabled={isLoading}
                                className="select-none rounded-md bg-white px-4 py-2 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 shadow-md shadow-gray-100/10 transition-all hover:shadow-lg hover:shadow-gray-100/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                {isLoading
                                    ? "Calculating..."
                                    : "Calculate Line Counts"}
                            </button>
                            <button
                                onClick={handleGeneratePdf}
                                disabled={isLoading}
                                className={`select-none rounded-md bg-white px-4 py-2 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 shadow-md shadow-gray-100/10 transition-all hover:shadow-lg hover:shadow-gray-100/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${visibility}`}
                                type="button"
                            >
                                pdf
                            </button>
                        </div>
                    </div>
                </div>
                {lineCounts && (
                    <div>
                        <p>Code Lines: {lineCounts.codeLines}</p>
                        <p>Comment Lines: {lineCounts.commentLines}</p>
                        <p>Blank Lines: {lineCounts.blankLines}</p>
                    </div>
                )}
                {code && (
                    <div style={{ height: "220px", overflowY: "scroll" }}>
                        <SyntaxHighlighter
                            language="java"
                            style={vscDarkPlus}
                            showLineNumbers={true}
                            wrapLines={true}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LineCountCalculator
