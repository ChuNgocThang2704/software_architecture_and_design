# Client architecture

Frontend da duoc sap xep lai de UI chi goi ham nghiep vu, khong goi endpoint truc tiep.

## Luong goi API

`Page/Component -> src/api/* -> src/api/request.js -> Backend`

## API folder

```text
src/api/
  request.js     # axios instance + request() dung chung
  users.js       # login
  tours.js       # tour and schedule APIs
  customers.js   # customer APIs
  bookings.js    # booking APIs
  partners.js    # partner APIs
  index.js       # barrel exports
```

## Nguyen tac

- Tat ca endpoint (`/api/...`) chi dat trong `src/api/*.js`.
- `request.js` cung cap 1 ham chung `request({ method, url, data, params })`.
- Page/component chi import ham nghiep vu tu `src/api`.

## Chay nhanh

```bash
npm install
npm run dev
```
