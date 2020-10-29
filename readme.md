# Firebase Bucket Proxy

Serve your bucket from everywhere with such simple proxy.

## Setup (env variables)

```
FIREBASE_BUCKET=your-bucket-name.appspot.com
```

## Basic rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow write: if request.auth != null;
      allow read; // allow to access without token
    }
  }
}

```
