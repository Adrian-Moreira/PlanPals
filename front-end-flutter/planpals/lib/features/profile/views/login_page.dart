import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/profile/views/signup_page.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    UserViewModel userViewModel = Provider.of<UserViewModel>(context);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Container(
                  margin: const EdgeInsets.only(bottom: 40.0),
                  child: Image.asset(
                    'assets/images/logo.jpg',
                    width: 150,
                    height: 150,
                  ),
                ),
                // Username Field
                TextFormField(
                  controller: _usernameController,
                  decoration: InputDecoration(
                    labelText: 'Username',
                    border: const OutlineInputBorder(),
                    prefixIcon: const Icon(Icons.person),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a username';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                // Password Field
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: const OutlineInputBorder(),
                    prefixIcon: const Icon(Icons.lock),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a password';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                // Login Button
                ElevatedButton(
                  onPressed: () async {
                    // Mark the function as async
                    if (_formKey.currentState?.validate() == true) {
                      // Fetch the user by username and wait for the result
                      await userViewModel
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/profile/views/login_page.dart
                          .login(_usernameController.text);
=======
                          .fetchUserByUserName(_usernameController.text);
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/profile/views/login_page.dart
=======
                          .fetchUserByUserName(_usernameController.text);
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb

                      // Check if the user has been fetched successfully
                      if (userViewModel.currentUser != null) {
                        // NAVIGATE TO THE HOME PAGE
                        Navigator.pushReplacementNamed(context, '/home');
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/profile/views/login_page.dart
                        // Navigator.pushReplacementNamed(context, '/test');
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/profile/views/login_page.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                      } else {
                        // Handle the case where the user was not found or there was an error
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                                'Failed to log in. User not found or an error occurred.'),
                          ),
                        );
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                    textStyle: const TextStyle(fontSize: 16),
                  ),
                  child: const Text('Login'),
                ),
                const SizedBox(height: 20),
                // Sign Up Link
                TextButton(
                  onPressed: () {
                    // Navigate to sign-up page
                    print('Navigate to sign up');
                    Navigator.pushReplacementNamed(context, '/signup');
                  },
                  child: const Text('Don\'t have an account? Sign Up'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
