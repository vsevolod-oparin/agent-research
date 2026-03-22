# Tasks

## Task 1

Review this Express.js endpoint:
```javascript
app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body;
  const query = `INSERT INTO users (name, email, role) VALUES ('${name}', '${email}', '${role}')`;
  const result = await db.query(query);
  res.json({ id: result.insertId, token: jwt.sign({ id: result.insertId }, 'secret123') });
});
```

## Task 2

Review this React component:
```jsx
function UserList({ users }) {
  const [filter, setFilter] = useState('');
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  });
  return users.filter(u => u.name.includes(filter)).map(u => <div>{u.name}</div>);
}
```

## Task 3

Review this Python function. File: services/payment.py
```python
def process_refund(user_id, amount):
    user = db.get_user(user_id)
    if user.balance >= amount:
        user.balance -= amount
        db.save(user)
        send_email(user.email, f"Refunded ${amount}")
        return True
    return False
```

## Task 4

Review this Go handler that was just added:
```go
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    _, err := db.Exec("DELETE FROM users WHERE id = ?", id)
    if err != nil {
        log.Println(err)
    }
    w.WriteHeader(200)
}
```

## Task 5

Review this TypeScript utility. Only the highlighted lines changed (marked >>>):
```typescript
export class Cache<T> {
  private store = new Map<string, { value: T; expiry: number }>();

>>> cleanup() {
>>>   const now = Date.now();
>>>   for (const [key, entry] of this.store) {
>>>     if (entry.expiry < now) this.store.delete(key);
>>>   }
>>> }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry || entry.expiry < Date.now()) return undefined;
    return entry.value;
  }
}
```
