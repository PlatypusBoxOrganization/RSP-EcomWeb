import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API = 'http://127.0.0.1:5004/api';

async function run(){
  try{
    const health = await fetch(`${API}/health`).then(r=>r.json());
    fs.writeFileSync('health_out.json', JSON.stringify(health,null,2));
    const login = await fetch(`${API}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo@example.com',password:'demo123'})}).then(r=>r.json());
    fs.writeFileSync('login_out.json', JSON.stringify(login,null,2));
    const token = login.token;
    const headers = {Authorization: `Bearer ${token}`};
    const wl1 = await fetch(`${API}/wishlist`,{headers}).then(r=>r.json());
    fs.writeFileSync('wl1.json', JSON.stringify(wl1,null,2));
    const add = await fetch(`${API}/wishlist`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({productId:'60d5ec49e1b0dc2c4c8d8f1c'})}).then(r=>r.json());
    fs.writeFileSync('wl_add.json', JSON.stringify(add,null,2));
    const wl2 = await fetch(`${API}/wishlist`,{headers}).then(r=>r.json());
    fs.writeFileSync('wl2.json', JSON.stringify(wl2,null,2));
    const del = await fetch(`${API}/wishlist/60d5ec49e1b0dc2c4c8d8f1c`,{method:'DELETE',headers}).then(r=>r.json());
    fs.writeFileSync('wl_del.json', JSON.stringify(del,null,2));
    const wl3 = await fetch(`${API}/wishlist`,{headers}).then(r=>r.json());
    fs.writeFileSync('wl3.json', JSON.stringify(wl3,null,2));
  }catch(e){
    fs.writeFileSync('error.txt', e.toString());
  }
  // keep alive
  setInterval(()=>{}, 60000);
}
run();
