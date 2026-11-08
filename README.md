# Multimodal Healthcare RAG Patient Portal — Next.js Frontend

A modern, responsive **Patient Portal** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase Auth**. It connects to the DermaAI Multimodal RAG backend to deliver real-time streaming consultations, skin image uploads with lightbox zoom, multi-thread history management, and one-click permanent data erasure.

---

## Key Features

- **Patient Authentication (`Supabase Auth`):** Secure email/password registration, login, persistent sessions, and prominent sign-out controls.
- **Real-Time SSE Streaming UI:** Renders live token streams with rich Markdown formatting (`react-markdown`), toast notifications (`sonner`), and one-click clipboard copy.
- **Multimodal Skin Image Upload:** Supports uploading skin photos with instant preview and full-screen zoom lightbox in chat history.
- **Consultation Thread Management:** Searchable sidebar history, instant thread switching/resuming, and 1-click clinical starter prompts.
- **Privacy & Clinical Accuracy Controls:**
  - **20-Message Thread Limit:** Live capacity counter (`X/20 msgs`) and automatic prompt to open a fresh consultation once full to prevent AI context drift.
  - **HIPAA-Ready Right-to-Erasure:** Confirmation modal that triggers permanent backend deletion of chat records, AI memory checkpoints, and uploaded images.
- **Decoupled Docker Architecture (Runtime Backend IP):** Built with Next.js `standalone` output and `entrypoint.sh` so the container image can connect to any backend server IP at runtime without rebuilding.

---

## Prerequisites & Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` in the root directory:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_SUPABASE_URL=https://supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   - **Frontend URL:** `http://localhost:3000`
   - *(Ensure the FastAPI backend is running on `http://localhost:8000` with CORS enabled for `http://localhost:3000`).*

---

## Docker Deployment (Dynamic Backend IP)

The frontend Docker image is completely decoupled from the backend server IP—build it once, push it to Docker Hub, and supply any deployed backend IP via `NEXT_PUBLIC_API_BASE_URL` when starting the container.

```bash
# 1. Build image with Supabase public credentials
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-public-key" \
  -t your-dockerhub-username/derma-rag-frontend:latest .

# 2. Push to Docker Hub
docker push your-dockerhub-username/derma-rag-frontend:latest

# 3. Run container pointing to your deployed backend server IP
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL="http://YOUR_BACKEND_SERVER_IP:8000/api" \
  --name derma-frontend \
  your-dockerhub-username/derma-rag-frontend:latest
```
