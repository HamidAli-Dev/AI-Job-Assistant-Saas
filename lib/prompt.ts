import dedent from "dedent";

export const getJobTitleDescPrompt = (jobDescription: string) => {
  return dedent`  
   You are a world-class career expert. Analyze the following job 
    description and generate:
    1. An appropriate job title
    2. A clean, HTML-formatted version of the job description

    Requirements for the title:
    1. It should be concise (3-5 words)
    2. It should capture the main focus of the role
    3. It should be professional and relevant to the job market

    Requirements for the HTML description:
    1. Use proper HTML tags (e.g., <p>, <ul>, <li>, <strong>)
    2. Organize the content into clear sections and spacing spacing using inline css <div style="margin:10px" /> 
    (e.g., Responsibilities, Requirements, Salary price, duration, experiences required, Benefits, Company culture)
    3. Remove any unnecessary or redundant information
    4. Ensure the formatting is clean and professional

    Instructions:
    - Return the title and HTML description in JSON format
    - Use the following structure:
      {
        "title": "Job Title",
        "htmlDescription": "<p>Formatted job description...</p>"
      }
    - Do not return an array. Return a single JSON object.

    Job Description:
    ${jobDescription}
    `;
};
