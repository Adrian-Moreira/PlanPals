import 'package:flutter/material.dart';
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:provider/provider.dart';

class SignUpPage extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _preferredNameController =
      TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

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
                // Preferred Name Field
                TextFormField(
                  controller: _preferredNameController,
                  decoration: InputDecoration(
                    labelText: 'Preferred Name',
                    border: const OutlineInputBorder(),
                    prefixIcon: const Icon(Icons.person_outline),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a preferred name';
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
                // Sign Up Button
                ElevatedButton(
                  onPressed: () async {
                    if (_formKey.currentState?.validate() == true) {
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/profile/views/signup_page.dart
                      User? fetchedUser = await userViewModel
=======
                      await userViewModel
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/profile/views/signup_page.dart
=======
                      await userViewModel
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                          .fetchUserByUserName(_usernameController.text);
        
                      print('SIGN UP: ${userViewModel.currentUser}');

<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/profile/views/signup_page.dart
                      if (fetchedUser != null) {
=======
                      if (userViewModel.currentUser != null) {
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/profile/views/signup_page.dart
=======
                      if (userViewModel.currentUser != null) {
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                        // User already exists
                        print('User already exists');
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Username already exists'),
                          ),
                        );
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/profile/views/signup_page.dart
=======
                        userViewModel.logout();   // set current user to null
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/profile/views/signup_page.dart
=======
                        userViewModel.logout();   // set current user to null
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                        return;
                      } 
                        // Add user
                        print('Adding user');
                        User user = User(
                          id: '',
                          userName: _usernameController.text,
                          preferredName: _preferredNameController.text,
                        );
                        userViewModel.addUser(user);

                        // Navigate to the home page
                        Navigator.pushReplacementNamed(context, '/login');
                      
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 15),
                    textStyle: const TextStyle(fontSize: 16),
                  ),
                  child: const Text('Sign Up'),
                ),
                const SizedBox(height: 20),
                // Login Link
                TextButton(
                  onPressed: () {
                    // Navigate to login page
                    print('Navigate to login');
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                  child: const Text('Already have an account? Login'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
