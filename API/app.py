from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
import json
from typing import List, Optional
from passlib.context import CryptContext

class Reservasi(BaseModel):
    reservasi_id: str
    user_id: str
    start_date: str
    end_date: str
    jenis_ruang: str
    jumlah_orang: int
    peralatan_khusus: List[str]
    metode_pembayaran: str
class JenisRuang(BaseModel):
    jenis_ruang_id: str
    nama: str
    kapasitas: int
    fasilitas: List[str]

class PeralatanKhusus(BaseModel):
    id_peralatan: str
    nama: str
    harga: int
    
class User(BaseModel):
    user_id: str
    password: str

json_filename_reservasi="reservasi.json"

with open(json_filename_reservasi,"r") as read_file:
	data_reservasi = json.load(read_file)

json_filename_jenis_ruang="jenis_ruang.json"

with open(json_filename_jenis_ruang,"r") as read_file:
	data_jenis_ruang = json.load(read_file)

json_filename2="user.json"

with open(json_filename2,"r") as read_file:
	data2 = json.load(read_file)
 
json_filename_peralatan = "peralatan_khusus.json"

with open(json_filename_peralatan, "r") as read_file:
    data_peralatan = json.load(read_file)

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
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return user_id

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

app = FastAPI()

@app.post('/register')
async def register(user:User):
    user_dict = user.dict()
    user_found = False
    for user_item in data2['user']:
        if user_item['user_id'] == user_dict['user_id']:
            user_found = True
            return "User ID "+str(user_dict['user_id'])+" exists."
    
    if not user_found:
        user_dict['password'] = hash_password(user_dict['password'])
        data2['user'].append(user_dict)
        with open(json_filename2,"w") as write_file:
            json.dump(data2, write_file)
            
        return user_dict
    raise HTTPException(
		status_code=404, detail=f'Registrasi Gagal'
	)

@app.post('/signin')
async def signin(user:User):
    user_dict = user.dict()
    user_found = False
    for user_item in data2['user']:
        if user_item['user_id'] == user_dict['user_id']:
            user_found = True
            if verify_password(user_dict['password'], user_item['password']):
                token_data = {"sub": user_item['user_id']}  
                token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
                return {"token": token, "message": "Signin successful"}
            else:
                raise HTTPException(status_code=404, detail="Password Anda Salah")
    raise HTTPException(
		status_code=404, detail=f'User Tidak Ditemukan'
	)

@app.get('/token/{user_id}')
async def return_token(user_id: str):
    token_data = {"sub": user_id}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}

@app.get('/reservasi', dependencies=[Depends(get_current_user)])
async def read_all_reservasi():
    return data_reservasi['reservasi']

@app.get('/reservasi/{reservasi_id}', dependencies=[Depends(get_current_user)])
async def read_reservasi(reservasi_id: str):
    for reservasi_item in data_reservasi['reservasi']:
        if reservasi_item['reservasi_id'] == reservasi_id:
            return reservasi_item
    raise HTTPException(
        status_code=404, detail=f'Reservasi not found'
    )

@app.post('/reservasi')
async def create_reservasi(reservasi: Reservasi, current_user: str = Depends(get_current_user)):
    reservasi_dict = reservasi.dict()
    reservasi_dict['user_id'] = current_user
    data_reservasi['reservasi'].append(reservasi_dict)
    with open(json_filename_reservasi, "w") as write_file:
        json.dump(data_reservasi, write_file)

    return reservasi_dict

@app.put('/reservasi/{reservasi_id}')
async def update_reservasi(reservasi_id: int, reservasi: Reservasi, current_user: str = Depends(get_current_user)):
    reservasi_dict = reservasi.dict()
    reservasi_found = False
    for reservasi_idx, reservasi_item in enumerate(data_reservasi['reservasi']):
        if reservasi_item['reservasi_id'] == reservasi_id and reservasi_item['user_id'] == current_user:
            reservasi_found = True
            data_reservasi['reservasi'][reservasi_idx] = reservasi_dict
            with open(json_filename_reservasi, "w") as write_file:
                json.dump(data_reservasi, write_file)
            return "Reservasi updated"
    
    if not reservasi_found:
        raise HTTPException(
            status_code=404, detail=f'Reservasi not found'
        )

@app.delete('/reservasi/{reservasi_id}')
async def delete_reservasi(reservasi_id: str, current_user: str = Depends(get_current_user)):
    reservasi_found = False
    for reservasi_idx, reservasi_item in enumerate(data_reservasi['reservasi']):
        if reservasi_item['reservasi_id'] == reservasi_id and reservasi_item['user_id'] == current_user:
            reservasi_found = True
            data_reservasi['reservasi'].pop(reservasi_idx)
            with open(json_filename_reservasi, "w") as write_file:
                json.dump(data_reservasi, write_file)
            return "Reservasi deleted"

    if not reservasi_found:
        raise HTTPException(
            status_code=404, detail=f'Reservasi not found'
        )
        
@app.get('/jenis-ruang', dependencies=[Depends(get_current_user)])
async def read_all_jenis_ruang():
    return data_jenis_ruang['jenis_ruang']

@app.get('/jenis-ruang/{jenis_ruang_id}', dependencies=[Depends(get_current_user)])
async def read_jenis_ruang(jenis_ruang_id: str):
    for jenis_ruang_item in data_jenis_ruang['jenis_ruang']:
        if jenis_ruang_item['jenis_ruang_id'] == jenis_ruang_id:
            return jenis_ruang_item
    raise HTTPException(
        status_code=404, detail=f'Jenis Ruang not found'
    )

@app.post('/jenis-ruang')
async def create_jenis_ruang(jenis_ruang: JenisRuang, current_user: str = Depends(get_current_user)):
    jenis_ruang_dict = jenis_ruang.dict()
    data_jenis_ruang['jenis_ruang'].append(jenis_ruang_dict)
    with open(json_filename_jenis_ruang, "w") as write_file:
        json.dump(data_jenis_ruang, write_file)

    return jenis_ruang_dict

@app.put('/jenis-ruang/{jenis_ruang_id}')
async def update_jenis_ruang(jenis_ruang_id: str, jenis_ruang: JenisRuang, current_user: str = Depends(get_current_user)):
    jenis_ruang_dict = jenis_ruang.dict()
    jenis_ruang_found = False
    for jenis_ruang_idx, jenis_ruang_item in enumerate(data_jenis_ruang['jenis_ruang']):
        if jenis_ruang_item['jenis_ruang_id'] == jenis_ruang_id:
            jenis_ruang_found = True
            data_jenis_ruang['jenis_ruang'][jenis_ruang_idx] = jenis_ruang_dict
            with open(json_filename_jenis_ruang, "w") as write_file:
                json.dump(data_jenis_ruang, write_file)
            return "Jenis Ruang updated"
    
    if not jenis_ruang_found:
        raise HTTPException(
            status_code=404, detail=f'Jenis Ruang not found'
        )

@app.delete('/jenis-ruang/{jenis_ruang_id}')
async def delete_jenis_ruang(jenis_ruang_id: str, current_user: str = Depends(get_current_user)):
    jenis_ruang_found = False
    for jenis_ruang_idx, jenis_ruang_item in enumerate(data_jenis_ruang['jenis_ruang']):
        if jenis_ruang_item['jenis_ruang_id'] == jenis_ruang_id:
            jenis_ruang_found = True
            data_jenis_ruang['jenis_ruang'].pop(jenis_ruang_idx)
            with open(json_filename_jenis_ruang, "w") as write_file:
                json.dump(data_jenis_ruang, write_file)
            return "Jenis Ruang deleted"

    if not jenis_ruang_found:
        raise HTTPException(
            status_code=404, detail=f'Jenis Ruang not found'
        )
        
@app.get('/peralatan-khusus', response_model=List[PeralatanKhusus])
async def read_all_peralatan():
    return data_peralatan['peralatan_khusus']

@app.get('/peralatan-khusus/{id_peralatan}', response_model=PeralatanKhusus)
async def read_peralatan(id_peralatan: str):
    for peralatan_item in data_peralatan['peralatan_khusus']:
        if peralatan_item['id_peralatan'] == id_peralatan:
            return peralatan_item
    raise HTTPException(
        status_code=404, detail=f'Peralatan not found'
    )

@app.post('/peralatan-khusus')
async def create_peralatan(peralatan: PeralatanKhusus, current_user: str = Depends(get_current_user)):
    peralatan_dict = peralatan.dict()
    data_peralatan['peralatan_khusus'].append(peralatan_dict)
    with open(json_filename_peralatan, "w") as write_file:
        json.dump(data_peralatan, write_file)

    return peralatan_dict

@app.put('/peralatan-khusus/{id_peralatan}')
async def update_peralatan(id_peralatan: str, peralatan: PeralatanKhusus, current_user: str = Depends(get_current_user)):
    peralatan_dict = peralatan.dict()
    peralatan_found = False
    for peralatan_idx, peralatan_item in enumerate(data_peralatan['peralatan_khusus']):
        if peralatan_item['id_peralatan'] == id_peralatan:
            peralatan_found = True
            data_peralatan['peralatan_khusus'][peralatan_idx] = peralatan_dict
            with open(json_filename_peralatan, "w") as write_file:
                json.dump(data_peralatan, write_file)
            return "Peralatan updated"

    if not peralatan_found:
        raise HTTPException(
            status_code=404, detail=f'Peralatan not found'
        )

@app.delete('/peralatan-khusus/{id_peralatan}')
async def delete_peralatan(id_peralatan: str, current_user: str = Depends(get_current_user)):
    peralatan_found = False
    for peralatan_idx, peralatan_item in enumerate(data_peralatan['peralatan_khusus']):
        if peralatan_item['id_peralatan'] == id_peralatan:
            peralatan_found = True
            data_peralatan['peralatan_khusus'].pop(peralatan_idx)
            with open(json_filename_peralatan, "w") as write_file:
                json.dump(data_peralatan, write_file)
            return "Peralatan deleted"

    if not peralatan_found:
        raise HTTPException(
            status_code=404, detail=f'Peralatan not found'
        )