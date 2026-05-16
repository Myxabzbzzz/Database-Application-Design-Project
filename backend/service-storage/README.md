# service-storage

Внутренний сервис для хранения файлов. Использует MinIO (S3-совместимое хранилище). Не доступен снаружи через nginx — только для межсервисного взаимодействия.

**Порт внутри Docker:** `8000`
**Порт на хост-машине (dev):** `8005`

---

## Аутентификация

Все запросы требуют заголовок:

```
X-Internal-Token: <значение из .env INTERNAL_TOKEN>
```

Без него — `403 Forbidden`.

---

## Роуты

### POST /api/upload — загрузить файл

**Headers:**
```
X-Internal-Token: <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

| Поле     | Тип  | Обязательно | Описание                                    |
|----------|------|-------------|---------------------------------------------|
| `file`   | File | Да          | Файл для загрузки (макс. 10 МБ)             |
| `folder` | Text | Нет         | Папка в хранилище (по умолчанию: `uploads`) |

**Пример запроса в Postman:**
- Method: `POST`
- URL: `http://localhost:8005/api/upload`
- Headers: `X-Internal-Token: <INTERNAL_TOKEN>`
- Body → form-data:
  - `file` (тип File) → выбрать файл
  - `folder` (тип Text) → `products`

**Ответ `201`:**
```json
{
    "url": "http://localhost/storage/storage/products/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

Эту `url` сохраняй в своей БД — она постоянная и открывается в браузере напрямую.

---

### DELETE /api/delete — удалить файл

**Headers:**
```
X-Internal-Token: <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "path": "products/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

> `path` — путь внутри бакета: `<folder>/<filename>` (без `/storage/storage/` из URL).

**Ответ `200`:**
```json
{
    "deleted": true
}
```

---

## Как стучаться из другого сервиса (Laravel)

Из `service-product`, `service-payment` и т.д. обращайся по Docker-имени `service-storage:8000`:

```php
$response = Http::withHeaders([
    'X-Internal-Token' => env('INTERNAL_TOKEN'),
])->attach(
    'file',
    file_get_contents($request->file('image')->getRealPath()),
    $request->file('image')->getClientOriginalName()
)->post('http://service-storage:8000/api/upload', [
    'folder' => 'products',
]);

$imageUrl = $response->json('url');
```

Добавь в `.env` каждого сервиса который будет загружать файлы:
```env
INTERNAL_TOKEN=<то же значение что в service-storage>
```

---

## Публичный доступ к файлам

Загруженные файлы доступны через nginx без авторизации:

```
http://localhost/storage/storage/<folder>/<filename>
```

В локальной сети (другое устройство):
```
http://<IP-хост-машины>/storage/storage/<folder>/<filename>
```

IP узнать командой: `ipconfig getifaddr en0`

---

## Структура хранилища в MinIO

```
bucket: storage
├── products/
│   └── uuid.jpg
└── uploads/
    └── uuid.pdf
```

Бакет создаётся автоматически при старте через контейнер `minio-init` с правами публичного чтения.
MinIO Console доступна по адресу `http://localhost:9001` (логин/пароль из `.env`: `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`).
