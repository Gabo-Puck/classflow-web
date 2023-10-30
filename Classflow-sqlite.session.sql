INSERT INTO User (
    email,
    name,
    lastname,
    role,
    password,
    emailVerified,
    createdAt,
    updatedAt,
    profilePic
  )
VALUES (
    'prueba4@gmail.com',
    'Jorge',
    'Mendez',
    'STUDENT',
    'e7cf3ef4f17c3999a94f2c6f612e8a888e5b1026878e4e19398b23bd38ec221a',
    1,
    DateTime('now'),
    DateTime('now'),
    ''
  );