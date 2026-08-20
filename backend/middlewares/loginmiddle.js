
const hashedpassword = await bcrypt.hash(newpassword, 10);
// Compare the provided password with the hashed password
const Ismatch = await bcrypt.compare(password, hashedpassword);