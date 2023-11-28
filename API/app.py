from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
import httpx
from supabase_py import create_client
from typing import List, Optional
from passlib.context import CryptContext

class Reservasi(BaseModel):
    reservasi_id: str
    username: str
    start_date: str
    end_date: str
    jenis_ruang_id: str
    jumlah_orang: int
    peralatan_khusus: List[str]
    total: int
    metode_pembayaran: str
    
class JenisRuang(BaseModel):
    jenis_ruang_id: str
    nama: str
    kapasitas: int
    fasilitas: List[str]
    harga: int
    

class PeralatanKhusus(BaseModel):
    id_peralatan: str
    nama: str
    harga: int
    
class User(BaseModel):
    username: str
    password: str

# JWT token authentication
ADMIN = "Admin123"
SECRET_KEY = "ayokebali-TST"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return username

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Ganti dengan URL API dan kunci API Supabase Anda
SUPABASE_URL = "https://vgaawvpppdrnurqbyszb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYWF3dnBwcGRybnVycWJ5c3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExNzY1NzksImV4cCI6MjAxNjc1MjU3OX0.zqjZhZhNX_AxdGuZ1vTHxjYZ1AApUNqJgT423go0Ci8"

#password = Mm5CiOLp2jGt1mlo

# Inisialisasi klien Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_supabase_user(username: str):
    async with httpx.AsyncClient() as client:
        # Mengambil data pengguna dari Supabase
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/user?select=username,password&username=eq.{username}",
            headers={"apikey": SUPABASE_KEY}
        )
    if response.status_code == 200:
        return response.json()[0] if response.json() else None
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to get user data from Supabase"
        )

app = FastAPI()

@app.post('/register')
async def register(user: User):
    user_dict = user.dict()

    # Cek apakah username sudah ada
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/user?select=username&username=eq.{user_dict['username']}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200 and response.json():
        return f"Username {user_dict['username']} already exists."

    # Hash password sebelum menyimpan ke Supabase
    user_dict['password'] = hash_password(user_dict['password'])

    # Kirim data ke Supabase
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/user",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json=user_dict,
        )

    if response.status_code == 201:
        return user_dict
    else:
        raise HTTPException(
            status_code=404, detail=f'Registrasi Gagal'
        )

@app.post('/signin')
async def signin(user:User):
    user_dict = user.dict()
    supabase_user = await get_supabase_user(user_dict['username'])

    if supabase_user:
        # Lakukan verifikasi password secara lokal
        if verify_password(user_dict['password'], supabase_user['password']):
            token_data = {"sub": supabase_user['username']}  
            token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
            return {"token": token, "message": "Signin successful", "username": user_dict['username']}
        else:
            raise HTTPException(status_code=404, detail="Password Anda Salah")
    raise HTTPException(
        status_code=404, detail=f'User Tidak Ditemukan'
    )

@app.get('/reservasi', dependencies=[Depends(get_current_user)])
async def read_all_reservasi():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/reservasi",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200:
        reservasi_list = response.json()
        return reservasi_list
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal mengambil data reservasi. Kode status: {response.status_code}'
        )

@app.get('/reservasi/{reservasi_id}', dependencies=[Depends(get_current_user)])
async def read_reservasi(reservasi_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/reservasi?reservasi_id=eq.{reservasi_id}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200 and response.json():
        reservasi_item = response.json()[0]
        return reservasi_item
    else:
        raise HTTPException(
            status_code=404, detail=f'Reservasi not found'
        )

@app.post('/reservasi')
async def create_reservasi(reservasi: Reservasi, current_user: str = Depends(get_current_user)):
    reservasi_dict = reservasi.dict()
    
    if reservasi_dict['username'] != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid User ID",
        )

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/reservasi",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json=reservasi_dict,
        )

    if response.status_code == 201:
        return reservasi_dict
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal menambahkan data reservasi. Kode status: {response.status_code}'
        )

@app.delete('/reservasi/{reservasi_id}')
async def delete_reservasi(reservasi_id: str, current_user: str = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/reservasi?reservasi_id=eq.{reservasi_id}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200 and response.json():
        reservasi_item = response.json()[0]

    if reservasi_item['username'] != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid User ID",
        )
    
    async with httpx.AsyncClient() as client:
        # Menghapus data reservasi dari Supabase
        response = await client.delete(
            f"{SUPABASE_URL}/rest/v1/reservasi?reservasi_id=eq.{reservasi_id}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 204:
        return "Reservasi deleted"
    elif response.status_code == 404:
        raise HTTPException(
            status_code=404, detail=f'Reservasi not found'
        )
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal menghapus data reservasi. Kode status: {response.status_code}'
        )
        
@app.get('/jenis-ruang', dependencies=[Depends(get_current_user)])
async def read_all_jenis_ruang():
    async with httpx.AsyncClient() as client:
        # Mengambil data jenis ruang dari Supabase
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/jenis_ruang",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200:
        jenis_ruang_list = response.json()
        return jenis_ruang_list
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal mengambil data jenis ruang. Kode status: {response.status_code}'
        )

@app.get('/jenis-ruang/{jenis_ruang_id}', dependencies=[Depends(get_current_user)])
async def read_jenis_ruang(jenis_ruang_id: str):
    async with httpx.AsyncClient() as client:
        # Mengambil data jenis ruang dari Supabase berdasarkan jenis_ruang_id
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/jenis_ruang?select=*.*&jenis_ruang_id=eq.{jenis_ruang_id}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200 and response.json():
        jenis_ruang_item = response.json()[0]
        return jenis_ruang_item
    else:
        raise HTTPException(
            status_code=404, detail=f'Jenis Ruang not found'
        )

@app.post('/jenis-ruang')
async def create_jenis_ruang(jenis_ruang: JenisRuang, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
        
    jenis_ruang_dict = jenis_ruang.dict()

    async with httpx.AsyncClient() as client:
        # Mengirim data ke Supabase
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/jenis_ruang",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json=jenis_ruang_dict,
        )

    if response.status_code == 201:
        return jenis_ruang_dict
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal menambahkan jenis ruang. Kode status: {response.status_code}'
        )

@app.put('/jenis-ruang/{jenis_ruang_id}')
async def update_jenis_ruang(jenis_ruang_id: str, jenis_ruang: JenisRuang, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
        
    jenis_ruang_dict = jenis_ruang.dict()

    async with httpx.AsyncClient() as client:
        # Mengirim data update ke Supabase
        response = await client.patch(
            f"{SUPABASE_URL}/rest/v1/jenis_ruang?jenis_ruang_id=eq.{jenis_ruang_id}",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json=jenis_ruang_dict,
        )

    if response.status_code == 204:
        return "Jenis Ruang updated"
    elif response.status_code == 404:
        raise HTTPException(
            status_code=404, detail=f'Jenis Ruang not found'
        )
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Failed to update jenis ruang. Kode status: {response.status_code}'
        )

@app.delete('/jenis-ruang/{jenis_ruang_id}')
async def delete_jenis_ruang(jenis_ruang_id: str, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
    
    async with httpx.AsyncClient() as client:
        # Mengirim permintaan DELETE ke Supabase
        response = await client.delete(
            f"{SUPABASE_URL}/rest/v1/jenis_ruang?jenis_ruang_id=eq.{jenis_ruang_id}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 204:
        return "Jenis Ruang deleted"
    elif response.status_code == 404:
        raise HTTPException(
            status_code=404, detail=f'Jenis Ruang not found'
        )
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Failed to delete jenis ruang. Kode status: {response.status_code}'
        )
        
@app.get('/peralatan-khusus', dependencies=[Depends(get_current_user)])
async def read_all_peralatan():
    async with httpx.AsyncClient() as client:
        # Mengambil semua data peralatan dari Supabase
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/peralatan_khusus",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200 and response.json():
        peralatan_khusus_list = response.json()
        return peralatan_khusus_list
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal mengambil data peralatan. Kode status: {response.status_code}'
        )

@app.get('/peralatan-khusus/{id_peralatan}', dependencies=[Depends(get_current_user)])
async def read_peralatan(id_peralatan: str):
    async with httpx.AsyncClient() as client:
        # Mengambil data peralatan dari Supabase berdasarkan id_peralatan
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/peralatan_khusus?id_peralatan=eq.{id_peralatan}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 200 and response.json():
        peralatan_khusus_item = response.json()[0]
        return peralatan_khusus_item
    else:
        raise HTTPException(
            status_code=404, detail=f'Peralatan not found'
        )

@app.post('/peralatan-khusus')
async def create_peralatan(peralatan: PeralatanKhusus, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
    
    peralatan_dict = peralatan.dict()

    async with httpx.AsyncClient() as client:
        # Menambahkan data peralatan ke Supabase
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/peralatan_khusus",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json=peralatan_dict,
        )

    if response.status_code == 201:
        return peralatan_dict
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Gagal menambahkan peralatan khusus. Kode status: {response.status_code}'
        )

@app.put('/peralatan-khusus/{id_peralatan}')
async def update_peralatan(id_peralatan: str, peralatan: PeralatanKhusus, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
    
    peralatan_dict = peralatan.dict()

    async with httpx.AsyncClient() as client:
        # Mengupdate data peralatan di Supabase
        response = await client.patch(
            f"{SUPABASE_URL}/rest/v1/peralatan_khusus?id_peralatan=eq.{id_peralatan}",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json=peralatan_dict,
        )

    if response.status_code == 204:
        return "Peralatan Khusus updated"
    elif response.status_code == 404:
        raise HTTPException(
            status_code=404, detail=f'Peralatan Khusus not found'
        )
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Failed to update peralatan khusus. Kode status: {response.status_code}'
        )

@app.delete('/peralatan-khusus/{id_peralatan}')
async def delete_peralatan(id_peralatan: str, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
    
    async with httpx.AsyncClient() as client:
        # Menghapus data peralatan dari Supabase
        response = await client.delete(
            f"{SUPABASE_URL}/rest/v1/peralatan_khusus?id_peralatan=eq.{id_peralatan}",
            headers={"apikey": SUPABASE_KEY}
        )

    if response.status_code == 204:
        return "Peralatan Khusus deleted"
    elif response.status_code == 404:
        raise HTTPException(
            status_code=404, detail=f'Peralatan Khusus not found'
        )
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f'Failed to delete peralatan khusus. Kode status: {response.status_code}'
        )