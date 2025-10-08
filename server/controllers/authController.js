export const googleCallback = (req, res) => {
  try {
    const { token, user } = req.user;

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, data: err });
  }
};
