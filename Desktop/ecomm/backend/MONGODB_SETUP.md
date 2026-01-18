# MongoDB Setup Guide

## Option 1: Local MongoDB

1. **Install MongoDB locally:**
   - macOS: `brew install mongodb-community`
   - Or download from [MongoDB website](https://www.mongodb.com/try/download/community)

2. **Start MongoDB:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Use in .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/ecomm
   ```

## Option 2: MongoDB Atlas (Cloud)

1. **Create a free cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new cluster (free tier available)

2. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

3. **Configure database access:**
   - Go to "Database Access" in Atlas
   - Create a database user
   - Set username and password
   - Give user "Read and write to any database" permission

4. **Configure network access:**
   - Go to "Network Access" in Atlas
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add specific IPs

5. **Update connection string:**
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name at the end:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecomm?retryWrites=true&w=majority
     ```

6. **Use in .env:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecomm?retryWrites=true&w=majority
   ```

## Testing Connection

After setting up, test the connection:
```bash
cd backend
npm run seed
```

If successful, you'll see:
```
MongoDB connected successfully
Admin user created successfully
```

## Troubleshooting

### Connection timeout
- Check network access in MongoDB Atlas
- Verify IP address is whitelisted
- Check firewall settings

### Authentication failed
- Verify username and password are correct
- Check database user has proper permissions
- Ensure special characters in password are URL-encoded

### Connection string format
- Make sure connection string includes database name: `...mongodb.net/ecomm?...`
- Verify `?retryWrites=true&w=majority` is at the end
