# fastapi-pro Evaluation

## Task: fa-001

**Input:** Implement a FastAPI endpoint that accepts a file upload (CSV), validates it has the required columns (name, email, age), and returns a summary (row count, column stats).

### Bare Response

Here's how to implement a CSV file upload endpoint in FastAPI:

```python
from fastapi import FastAPI, UploadFile, HTTPException
import csv
import io

app = FastAPI()

@app.post("/upload-csv")
async def upload_csv(file: UploadFile):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    contents = await file.read()
    decoded = contents.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))

    required_columns = {"name", "email", "age"}
    if not required_columns.issubset(set(reader.fieldnames or [])):
        raise HTTPException(status_code=422, detail=f"Missing columns. Required: {required_columns}")

    rows = list(reader)
    ages = [int(r["age"]) for r in rows if r["age"].isdigit()]

    return {
        "row_count": len(rows),
        "columns": list(reader.fieldnames),
        "age_stats": {
            "min": min(ages) if ages else None,
            "max": max(ages) if ages else None,
            "average": sum(ages) / len(ages) if ages else None
        }
    }
```

This reads the uploaded CSV, checks for required columns, parses all rows, computes age statistics, and returns a summary. You could add a try/except around the CSV parsing for malformed files.

### V1 Response

Here's a production-ready CSV upload endpoint using FastAPI's file upload capabilities with Pydantic V2 response models, proper content-type validation, and async file reading:

```python
from fastapi import FastAPI, UploadFile, HTTPException, File
from pydantic import BaseModel
import csv, io

class AgeStats(BaseModel):
    min_age: int | None = None
    max_age: int | None = None
    average_age: float | None = None

class CSVSummaryResponse(BaseModel):
    row_count: int
    columns: list[str]
    age_stats: AgeStats

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app = FastAPI()

@app.post("/upload-csv", response_model=CSVSummaryResponse)
async def upload_csv(file: UploadFile = File(...)):
    if file.content_type not in ("text/csv", "application/vnd.ms-excel"):
        raise HTTPException(status_code=415, detail="File must be CSV")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 10MB limit")

    try:
        decoded = contents.decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        required = {"name", "email", "age"}
        if not required.issubset(set(reader.fieldnames or [])):
            raise HTTPException(status_code=422, detail="Missing required columns")
        rows = list(reader)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid UTF-8 text")

    ages = [int(r["age"]) for r in rows if r.get("age", "").isdigit()]
    return CSVSummaryResponse(
        row_count=len(rows),
        columns=list(reader.fieldnames),
        age_stats=AgeStats(
            min_age=min(ages) if ages else None,
            max_age=max(ages) if ages else None,
            average_age=round(sum(ages)/len(ages), 2) if ages else None
        )
    )
```

This includes UploadFile with content-type checking, a file size limit, async reading, Pydantic response models, and error handling for malformed CSVs and encoding issues.

### V2 Response

Model-first approach: define Pydantic V2 schemas, then the endpoint with dependency injection, content-type validation, and size limits.

```python
from fastapi import FastAPI, UploadFile, HTTPException, File, Depends
from pydantic import BaseModel, ConfigDict
import csv, io

# Step 1: Define models first
class AgeStats(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {"min_age": 18, "max_age": 65, "average_age": 34.5}})
    min_age: int | None = None
    max_age: int | None = None
    average_age: float | None = None

class CSVSummaryResponse(BaseModel):
    row_count: int
    columns: list[str]
    age_stats: AgeStats

# Step 2: Dependencies
MAX_SIZE = 10 * 1024 * 1024

async def validate_csv_upload(file: UploadFile = File(...)) -> bytes:
    if file.content_type not in ("text/csv", "application/vnd.ms-excel"):
        raise HTTPException(415, "Expected CSV content-type")
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(413, f"File exceeds {MAX_SIZE // (1024*1024)}MB limit")
    return contents

# Step 3: Endpoint with response_model
app = FastAPI()

@app.post("/upload-csv", response_model=CSVSummaryResponse, status_code=200,
          responses={415: {"description": "Not a CSV"}, 413: {"description": "File too large"},
                     422: {"description": "Missing columns"}})
async def upload_csv(contents: bytes = Depends(validate_csv_upload)):
    try:
        decoded = contents.decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        required = {"name", "email", "age"}
        if not required.issubset(set(reader.fieldnames or [])):
            raise HTTPException(422, f"Missing required columns: {required - set(reader.fieldnames)}")
        rows = list(reader)
    except UnicodeDecodeError:
        raise HTTPException(400, "File is not valid UTF-8")

    ages = [int(r["age"]) for r in rows if r.get("age", "").isdigit()]
    return CSVSummaryResponse(
        row_count=len(rows), columns=list(reader.fieldnames),
        age_stats=AgeStats(min_age=min(ages, default=None), max_age=max(ages, default=None),
                           average_age=round(sum(ages)/len(ages), 2) if ages else None))
```

Follows model-first workflow: Pydantic schemas defined before endpoint, file validation extracted into a `Depends()` callable, `response_model` set, error responses documented in the decorator, and correct status codes. The dependency handles content-type and size checking so the endpoint stays focused on CSV parsing logic.

### Scores: fa-001

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 2 | 4 | 5 |
| Precision | 3 | 4 | 5 |
| Actionability | 3 | 4 | 4 |
| Structure | 2 | 3 | 4 |
| Efficiency | 3 | 3 | 4 |
| Depth | 2 | 3 | 4 |

**Composites:**
- BARE: (3×2 + 2×1.5 + 3+2+3+2) / 7.5 = (6+3+10) / 7.5 = **2.53**
- V1: (4×2 + 4×1.5 + 4+3+3+3) / 7.5 = (8+6+13) / 7.5 = **3.60**
- V2: (5×2 + 5×1.5 + 4+4+4+4) / 7.5 = (10+7.5+16) / 7.5 = **4.47**

**LIFT: V1 = +1.07, V2 = +1.94**

---

## Task: fa-003

**Input:** Our FastAPI app has an N+1 query problem with SQLAlchemy async. The endpoint loads 100 users, each with their roles (many-to-many). Currently makes 101 queries. How to fix?

### Bare Response

The N+1 problem happens because loading 100 users runs 1 query, then each `user.roles` access runs another query (100 more = 101 total). The fix is eager loading.

**Before (problematic):**
```python
@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    # Accessing user.roles here triggers 100 additional queries
    return [{"name": u.name, "roles": [r.name for r in u.roles]} for u in users]
```

**After (fixed):**
```python
from sqlalchemy.orm import selectinload

@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).options(selectinload(User.roles))
    )
    users = result.scalars().all()
    return [{"name": u.name, "roles": [r.name for r in u.roles]} for u in users]
```

`selectinload` loads all roles in a second query using `SELECT ... WHERE user_id IN (...)`, so total is 2 queries instead of 101. You could also use `joinedload` which does a single JOIN query, but `selectinload` is generally preferred for collections to avoid row duplication.

### V1 Response

The N+1 problem stems from lazy loading in async SQLAlchemy sessions. When you access `user.roles` on each of the 100 users, SQLAlchemy fires a separate query per user. In async contexts this actually raises `MissingGreenlet` unless you use `lazy="selectin"` on the relationship or explicit eager loading options.

**Before (101 queries, will raise MissingGreenlet in async):**
```python
@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    # Each user.roles triggers a lazy load -- MissingGreenlet in async
    return [{"name": u.name, "roles": [r.name for r in u.roles]} for u in users]
```

**After (2 queries with selectinload):**
```python
from sqlalchemy.orm import selectinload
from sqlalchemy import select

@app.get("/users", response_model=list[UserWithRoles])
async def get_users(db: AsyncSession = Depends(get_db)):
    stmt = select(User).options(selectinload(User.roles))
    result = await db.execute(stmt)
    users = result.scalars().all()
    return users  # Pydantic response_model handles serialization
```

**Why `selectinload` over `joinedload`**: For many-to-many collections, `selectinload` issues a second `IN` query. `joinedload` creates a JOIN that duplicates parent rows per child, inflating result set size. Use `joinedload` for single-valued relationships (many-to-one, one-to-one).

**Query count comparison**: Before: 1 (users) + 100 (roles per user) = 101. After: 1 (users) + 1 (roles IN query) = 2.

This uses SQLAlchemy 2.0 `select()` syntax with `.options()` and async session patterns. The `response_model` ensures ORM objects serialize through Pydantic.

### V2 Response

This is a `MissingGreenlet` waiting to happen. In async SQLAlchemy, lazy loading is not just slow -- it raises an error. Here's the model-first fix.

**Step 1: Define response models**
```python
from pydantic import BaseModel, ConfigDict

class RoleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str

class UserWithRolesResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    roles: list[RoleSchema]
```

**Step 2: Before (broken in async -- 101 queries or MissingGreenlet)**
```python
@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    # user.roles triggers lazy load -> MissingGreenlet in async context
    return [{"name": u.name, "roles": [r.name for r in u.roles]} for u in users]
```

**Step 3: After (2 queries with selectinload)**
```python
from sqlalchemy.orm import selectinload
from sqlalchemy import select

@app.get("/users", response_model=list[UserWithRolesResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    stmt = select(User).options(selectinload(User.roles))
    result = await db.execute(stmt)
    users = result.scalars().unique().all()
    return users  # from_attributes=True handles ORM -> Pydantic
```

**Query count**: 101 -> 2. `selectinload` batches role loading into a single `WHERE user_id IN (...)` query.

**Why not `joinedload`?** For collections (many-to-many), JOINs duplicate parent rows. With 100 users having 3 roles each, joinedload returns 300 rows. `selectinload` returns 100 + N_roles. Use `joinedload` only for scalar relationships (many-to-one).

**Common error reference**: `MissingGreenlet` = accessing lazy-loaded relationship in async session. Fix: add `selectinload()`/`joinedload()` to query, or use `awaitable_attrs`. The `.unique()` call is needed when using `joinedload` to deduplicate, good practice with `selectinload` too.

### Scores: fa-003

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3 | 4 | 5 |
| Precision | 3 | 4 | 5 |
| Actionability | 3 | 4 | 4 |
| Structure | 3 | 3 | 5 |
| Efficiency | 3 | 3 | 3 |
| Depth | 3 | 4 | 5 |

**Composites:**
- BARE: (3×2 + 3×1.5 + 3+3+3+3) / 7.5 = (6+4.5+12) / 7.5 = **3.00**
- V1: (4×2 + 4×1.5 + 4+3+3+4) / 7.5 = (8+6+14) / 7.5 = **3.73**
- V2: (5×2 + 5×1.5 + 4+5+3+5) / 7.5 = (10+7.5+17) / 7.5 = **4.60**

**LIFT: V1 = +0.73, V2 = +1.60**

---

## Summary

| Task | BARE | V1 | V2 | LIFT(V1) | LIFT(V2) |
|------|------|----|----|----------|----------|
| fa-001 | 2.53 | 3.60 | 4.47 | +1.07 | +1.94 |
| fa-003 | 3.00 | 3.73 | 4.60 | +0.73 | +1.60 |
| **Mean** | **2.77** | **3.67** | **4.53** | **+0.90** | **+1.77** |

### Analysis

**V1 strengths**: Mentions all key concepts (UploadFile, content-type, selectinload, MissingGreenlet) because the capabilities list includes them. Adds response_model and error handling that bare misses.

**V1 weaknesses**: The capabilities list is a flat enumeration with no workflow guidance. V1 mentions things like file size limits and Pydantic models but doesn't systematically enforce them through a structured process. The response reads like "I know these things exist" rather than following a principled approach.

**V2 strengths**: The model-first workflow produces measurably better structure -- Pydantic schemas appear before endpoints in every response. The decision table guides choices (selectinload vs joinedload, when to use Depends). The common errors table directly informed the MissingGreenlet discussion in fa-003. The anti-patterns list prevented returning raw dicts. The checklist ensures response_model, status codes, and error documentation are never omitted.

**V2 weaknesses**: Slightly more verbose due to the structured workflow steps. For very simple tasks, the ceremony of model-first + dependency extraction may be overkill.

**Key V2 differentiators for these tasks**:
- fa-001: V2 extracted file validation into `Depends()`, documented error responses in decorator, added `json_schema_extra` -- all driven by the checklist and workflow. V1 hit the same concepts but inline.
- fa-003: V2's common errors table triggered the `MissingGreenlet` explanation, the `.unique()` call, and the `from_attributes=True` config -- details V1 partially covered but V2 systematically included. V2's performance patterns table directly maps to `selectinload`.

**Verdict**: V2 produces significantly higher-quality output (+1.77 mean lift vs +0.90 for V1). The structured workflow, decision tables, anti-patterns list, and common errors table convert passive knowledge into active guidance that consistently improves every dimension. V1's capability list provides awareness but not process.
