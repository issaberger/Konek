# Konek - AI Homework Helper

Konek se yon asistan devwa entèlijan ki fèt espesyalman pou elèv an Ayiti. Li itilize entèlijans atifisyèl pou ede elèv yo konprann epi rezoud devwa yo an Kreyòl Ayisyen.

## Features (Karakteristik)
- **Kamera / Upload**: Pran foto devwa a epi Konek ap li l.
- **Eksplikasyon an Kreyòl**: Jwenn eksplikasyon etap pa etap nan lang manman w.
- **Vwa (Text-to-Speech)**: Konek ka li eksplikasyon an awotvwa pou ou.
- **Egzèsis**: Fè ti egzèsis apre chak devwa pou w verifye si w konprann.
- **Klasman & Badj**: Genyen pwen ak badj pou w rete motive.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, PWA
- Backend: Firebase (Auth, Firestore)
- AI: Google Gemini API (Vision, Text, TTS) & xAI Grok API (Optional)

## Deployment Instructions
1. **Environment Variables**: Set `GEMINI_API_KEY` and optionally `VITE_GROK_API_KEY` in your environment.
2. **Firebase**: Create a Firebase project, enable Firestore and Google Auth. Update `firebase-applet-config.json`.
3. **Build**: Run `npm run build`.
4. **Deploy**: Deploy the `dist` folder to Vercel, Firebase Hosting, or Cloud Run.

## How to Promote Konek to Students in Haiti
1. **WhatsApp Groups**: Share the PWA link in school and parent WhatsApp groups. The app is lightweight and works well on mobile.
2. **Schools & Teachers**: Introduce Konek to teachers as a supplementary tool for students to use at home.
3. **Radio Stations**: Local radio is huge in Haiti. A short ad explaining "Yon pwofesè nan pòch ou" (A teacher in your pocket) will drive adoption.
4. **Facebook**: Share short videos showing a student taking a picture of a math problem and getting the answer in Kreyòl.
