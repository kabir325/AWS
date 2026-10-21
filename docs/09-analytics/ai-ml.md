# AI & Machine Learning Services

> Pre-trained AI services to recognize by use case, plus SageMaker and Bedrock for custom and generative AI.

Category: **Analytics & Machine Learning** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Vision, speech and language](#vision-speech-and-language)
- [Search, recommendations and forecasting](#search-recommendations-and-forecasting)
- [Platforms](#platforms)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Vision, speech and language

- **Amazon Rekognition** - Image and video analysis: objects, faces, celebrity recognition, text in images, content moderation, PPE detection.
- **Amazon Textract** - Extract text, forms and tables from scanned documents (OCR+).
- **Amazon Transcribe** - Speech to text (with PII redaction, custom vocabulary, medical).
- **Amazon Polly** - Text to lifelike speech (SSML, lexicons).
- **Amazon Translate** - Neural machine translation between languages.
- **Amazon Comprehend** - NLP: sentiment, entities, key phrases, language detection, topic modeling, PII detection (Comprehend Medical for health text).
- **Amazon Lex** - Build conversational chatbots (voice/text), same tech as Alexa; integrates with Amazon Connect (contact center).

## Search, recommendations and forecasting

- **Amazon Kendra** - Intelligent enterprise document search with natural language questions across many sources.
- **Amazon Personalize** - Real-time personalized recommendations (same tech as amazon.com).
- **Amazon Forecast** - Time series forecasting (demand, inventory). Note: closed to new customers; SageMaker Canvas recommended.
- **Amazon Fraud Detector** - Detect online fraud (fake accounts, payment fraud).
- **Amazon Augmented AI (A2I)** - Human review workflows for low-confidence ML predictions.

## Platforms

- **Amazon SageMaker AI** - Build, train, tune and deploy custom ML models: notebooks, training jobs, endpoints, Ground Truth labeling, Canvas (no-code), Feature Store, Model Monitor.
- **Amazon Bedrock** - Serverless access to foundation models (Anthropic Claude, Amazon Nova/Titan, Llama, etc.) via API; knowledge bases (RAG), agents, guardrails, fine-tuning.
- **Amazon Q** - Generative AI assistant for business (Q Business) and developers (Q Developer).

## Exam tips

- Faces / objects / moderation in images or video -> Rekognition. Text from scanned forms -> Textract.
- Speech-to-text -> Transcribe. Text-to-speech -> Polly. Translation -> Translate.
- Sentiment / entities in text -> Comprehend. Chatbot -> Lex. Contact center -> Connect.
- Document search with natural language -> Kendra. Recommendations -> Personalize.
- Custom model training -> SageMaker. Generative AI with foundation models -> Bedrock.

## Practice questions

**Q1.** A company needs to automatically detect inappropriate content in images uploaded by users. Which service should be used?

- A. Amazon Comprehend
- B. Amazon Rekognition
- C. Amazon Textract
- D. Amazon Polly

<details><summary>Answer</summary>

**B** - Rekognition provides image and video content moderation.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A company wants to analyze customer reviews to determine whether they are positive or negative. Which service fits?

- A. Amazon Comprehend
- B. Amazon Lex
- C. Amazon Translate
- D. Amazon Kendra

<details><summary>Answer</summary>

**A** - Comprehend performs sentiment analysis on text.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** An insurance company needs to extract data from scanned claim forms including tables and key-value pairs. Which service should be used?

- A. Amazon Rekognition
- B. Amazon Textract
- C. Amazon Transcribe
- D. Amazon Comprehend

<details><summary>Answer</summary>

**B** - Textract extracts text, forms and tables from documents.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A call center wants to convert recorded calls to text and then detect customer sentiment. Which combination should be used?

- A. Polly and Lex
- B. Transcribe and Comprehend
- C. Textract and Translate
- D. Rekognition and Kendra

<details><summary>Answer</summary>

**B** - Transcribe converts speech to text, and Comprehend analyzes sentiment.

_Domain: Design High-Performing Architectures_

</details>

**Q5.** A company wants to build a generative AI application using foundation models through an API without managing infrastructure or training models. Which service should be used?

- A. Amazon SageMaker training jobs
- B. Amazon Bedrock
- C. Amazon Personalize
- D. Amazon Lex

<details><summary>Answer</summary>

**B** - Bedrock provides serverless API access to foundation models with RAG, agents and guardrails.

_Domain: Design High-Performing Architectures_

</details>
