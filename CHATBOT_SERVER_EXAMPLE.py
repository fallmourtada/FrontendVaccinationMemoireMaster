# Exemple - Serveur Chatbot FastAPI
# À adapter selon votre infrastructure

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI(title="Vaccination Chatbot API", version="1.0.0")

# ==============================
# 🔹 CORS - IMPORTANT POUR LE FRONTEND
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite default port
        "http://localhost:3000",      # React default port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        # En production, remplacer par votre domaine:
        # "https://vaccimed.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# 🔹 EMBEDDINGS + FAISS
# ==============================
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = FAISS.load_local(
    "vaccination_index",
    embedding_model,
    allow_dangerous_deserialization=True
)

# ==============================
# 🔹 MODELE (COLAB)
# ==============================
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

tokenizer = None
model = None

# ==============================
# 🔹 CONFIG GENERATION
# ==============================
CONFIG_GENERATION = {
    "max_new_tokens": 200,
    "temperature": 0.3,
    "top_p": 0.9,
    "repetition_penalty": 1.15,
    "do_sample": True,
}

# ==============================
# 🔹 CONTEXTE
# ==============================
def recuperer_contexte(question: str, k: int = 5, max_chars: int = 2000):
    """Récupère le contexte pertinent de FAISS"""
    docs = vectorstore.similarity_search(question, k=k)
    
    morceaux = []
    total = 0
    
    for i, doc in enumerate(docs):
        texte = f"[Source {i+1}] {doc.page_content}"
        
        if total + len(texte) > max_chars:
            break
        
        morceaux.append(texte)
        total += len(texte)
    
    return "\n\n".join(morceaux), docs

# ==============================
# 🔹 PROMPT
# ==============================
def construire_prompt(contexte: str, question: str) -> str:
    """Construit le prompt avec contexte"""
    return f"""Tu es un assistant pour la vaccination en Afrique particulièrement au Sénégal.
Réponds uniquement avec les informations du contexte, en français.
Si l'information n'est pas dans le contexte, dis "Information non disponible".

Contexte:
{contexte}

Question:
{question}

Réponse:
"""

# ==============================
# 🔹 HEALTH CHECK
# ==============================
@app.get("/health")
def health_check():
    """Vérifier que le serveur fonctionne"""
    return {"status": "ok", "service": "vaccination-chatbot"}

# ==============================
# 🔹 API - ENDPOINT PRINCIPAL
# ==============================
@app.get("/ask")
def ask_question(question: str):
    """
    Endpoint principal - Poser une question au chatbot
    
    Parameters:
    - question (str): La question concernant la vaccination
    
    Returns:
    - response (str): La réponse du chatbot
    """
    global tokenizer, model
    
    # 🔥 Charger le modèle une seule fois
    if tokenizer is None:
        print("[INIT] Chargement du tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    if model is None:
        print("[INIT] Chargement du modèle...")
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float32,
            device_map="cpu"
        )
    
    # 🔹 Récupérer le contexte
    contexte, docs = recuperer_contexte(question)
    
    print(f"[QUERY] Question: {question}")
    print(f"[CONTEXT] Nombre de documents: {len(docs)}")
    
    # 🔹 Construire le prompt
    prompt = construire_prompt(contexte, question)
    
    # 🔹 Tokenizer
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )
    
    # 🔹 Génération
    outputs = model.generate(
        **inputs,
        **CONFIG_GENERATION,
        pad_token_id=tokenizer.eos_token_id
    )
    
    # 🔹 Décoder la réponse
    reponse = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # 🔹 Extraire la réponse après le prompt
    if "Réponse:" in reponse:
        reponse = reponse.split("Réponse:")[-1].strip()
    
    print(f"[RESPONSE] {reponse[:100]}...")
    
    return {"response": reponse}

# ==============================
# 🔹 ENTRY POINT
# ==============================
if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Démarrage du serveur Chatbot...")
    print("📍 http://127.0.0.1:8001")
    print("📚 Docs: http://127.0.0.1:8001/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        reload=False  # True en développement
    )
