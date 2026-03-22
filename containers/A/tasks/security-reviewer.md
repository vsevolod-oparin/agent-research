# Tasks

## Task 1

Review this Node.js file upload handler:
```javascript
app.post('/upload', (req, res) => {
  const file = req.files.avatar;
  const path = `./uploads/${req.body.username}/${file.name}`;
  file.mv(path, (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Uploaded');
  });
});
```

## Task 2

Review this authentication middleware:
```python
@app.before_request
def check_auth():
    if request.path in ['/login', '/register', '/health']:
        return
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        g.user_id = payload['user_id']
    except:
        return jsonify({'error': 'Unauthorized'}), 401
```

## Task 3

Review this API endpoint for admin operations:
```javascript
app.get('/api/admin/users', async (req, res) => {
  if (req.query.admin === 'true') {
    const users = await User.find({}).select('+password +ssn');
    res.json(users);
  } else {
    res.status(403).json({ error: 'Not admin' });
  }
});
```

## Task 4

Review this password reset flow:
```python
def reset_password(request):
    email = request.POST['email']
    user = User.objects.get(email=email)
    token = hashlib.md5(str(time.time()).encode()).hexdigest()
    user.reset_token = token
    user.save()
    send_email(email, f"Reset link: https://app.com/reset?token={token}")
    return JsonResponse({'status': 'sent'})
```

## Task 5

Review this CORS configuration:
```javascript
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));
```
And this cookie setting:
```javascript
res.cookie('session', token, { httpOnly: true, sameSite: 'None', secure: true });
```
