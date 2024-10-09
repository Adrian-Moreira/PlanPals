import 'package:flutter/material.dart';
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    UserViewModel userViewModel = Provider.of<UserViewModel>(context);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Container(
                  margin: EdgeInsets.only(bottom: 40.0),
                  child: Image.asset(
                    'assets/images/logo.jpg',
                    width: 100,
                    height: 100,
                  ),
                ),
                // Username Field
                TextFormField(
                  controller: _usernameController,
                  decoration: InputDecoration(
                    labelText: 'Username',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.person),
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
                SizedBox(height: 20),
                // Password Field
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.lock),
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
                SizedBox(height: 20),
                // Login Button
                ElevatedButton(
                  onPressed: () async {
                    // Mark the function as async
                    if (_formKey.currentState?.validate() == true) {
                      // Fetch the user by username and wait for the result
                      await userViewModel
                          .fetchUserByUserName(_usernameController.text);

                      // Check if the user has been fetched successfully
                      if (userViewModel.currentUser != null) {
                        // NAVIGATE TO THE HOME PAGE
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => HomePage(
                              loggedIn: userViewModel.currentUser!,
                            ),
                          ),
                        );
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
                    padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                    textStyle: TextStyle(fontSize: 16),
                  ),
                  child: Text('Login'),
                ),
                SizedBox(height: 20),
                // Sign Up Link
                TextButton(
                  onPressed: () {
                    // Navigate to sign-up page
                    print('Navigate to sign up');
                  },
                  child: Text('Don\'t have an account? Sign Up'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
