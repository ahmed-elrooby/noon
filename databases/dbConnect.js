const DbConnect = async () => {
  try {
    console.log("URI:", process.env.DB_CONNECTION?.slice(0, 30));

    await mongoose.connect(process.env.DB_CONNECTION);

    console.log("✅ DB Connected");
  } catch (err) {
    console.error("❌", err);
  }
};

export default DbConnect;
