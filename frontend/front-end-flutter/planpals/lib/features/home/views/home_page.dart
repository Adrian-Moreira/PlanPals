import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF6A11CB), Color(0xFF2575FC)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // Logo Image
              Image.asset(
                'assets/images/logo.jpg',
                width: 150,
                height: 150,
                errorBuilder: (context, error, stackTrace) {
                  return const Text('Error loading logo', style: TextStyle(color: Colors.white));
                },
              ),
              const SizedBox(height: 20),

              // Welcome Text
              const Text(
                'Welcome to PlanPals!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 30),

              // Buttons
              _buildStyledButton(
                context,
                label: 'Go to Travel Planner',
                onPressed: () => Navigator.pushNamed(context, '/planners'),
                icon: Icons.airplanemode_active,
              ),
              const SizedBox(height: 20),
              _buildStyledButton(
                context,
                label: 'Go to Shopping Lists',
                onPressed: () => Navigator.pushNamed(context, '/shoppingLists'),
                icon: Icons.shopping_cart,
              ),
              const SizedBox(height: 20),
              _buildStyledButton(
                context,
                label: 'Go to Todo Lists',
                onPressed: () => Navigator.pushNamed(context, '/todoLists'),
                icon: Icons.check_circle,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper to create a styled button
  Widget _buildStyledButton(BuildContext context,
      {required String label, required VoidCallback onPressed, required IconData icon}) {
    return SizedBox(
      width: MediaQuery.of(context).size.width * 0.8,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(
          label,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
        ),
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16), backgroundColor: const Color(0xFF2575FC), // Background color
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          elevation: 6,
          shadowColor: Colors.black45,
        ),
      ),
    );
  }
}
