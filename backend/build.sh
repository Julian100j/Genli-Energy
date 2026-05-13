{
    "builds": [
      {
        "composer": "composer.json"
      }
    ],
    "version": 2,
    "routes": [
      {
        "src": "/builds/(?<desired>.*)",
        "dest": "/builds/$desired"
      }
    ]
  }
}