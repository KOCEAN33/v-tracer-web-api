import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  googleLogin(ip, req, res) {
    if (!req.user) {
      return 'No user from google';
    }

    if (req.user) {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify(
          req.user,
        )}', '*');window.close()</script>`,
      );
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}

// http://localhost:8000/api/auth/google/redirect
