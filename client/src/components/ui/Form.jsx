import React, { useState } from "react";
import Input from "./Input";
import Modal from "./Modal";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulated backend validation
    setTimeout(() => {
      setLoading(false);

      // Fake error condition
      if (code.toLowerCase().includes("error")) {
        setError({
          line: 3,
          message: "SyntaxError: Unexpected token 'error'.",
        });
      } else {
        navigate("/result");
      }
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* File Upload */}
        <div>
          <label
            htmlFor="codeFile"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Or upload a file (.c, .py, .sh, .txt)
          </label>
          <input
            type="file"
            id="codeFile"
            accept=".c,.py,.sh,.txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-foreground border rounded-md cursor-pointer bg-background file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-on-accent hover:file:bg-accent-dark"
          />
        </div>

        {/* Text Input */}
        <Input
          label="Enter Your Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. console.log('Hello')"
          id="user-code"
        />

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error on line {error.line}:</strong> {error.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md bg-accent text-on-accent hover:bg-accent-dark transition"
        >
          Check Code
        </button>
      </form>

      {/* Modal Loader */}
      <Modal
        isOpen={loading}
        onClose={() => setLoading(false)}
        title="Checking Code"
      >
        <Loading />
      </Modal>
    </>
  );
};

export default Form;
