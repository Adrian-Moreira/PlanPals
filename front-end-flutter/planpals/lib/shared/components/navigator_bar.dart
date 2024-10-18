import 'package:flutter/material.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:provider/provider.dart';

class NavigatorAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  const NavigatorAppBar({
    super.key,
    required this.title,
  });

  @override
  Size get preferredSize => const Size.fromHeight(
      kToolbarHeight); // Set the preferred size for the AppBar

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title), // You can customize this
      actions: <Widget>[
        PopupMenuButton<String>(
          icon: const Icon(Icons.menu),
          onSelected: (String result) {
            if (result == 'Logout') {
              // Call logout methods from relevant providers
              Provider.of<UserViewModel>(context, listen: false).logout();
              Provider.of<PlannerViewModel>(context, listen: false).logout();

              Future.delayed(const Duration(milliseconds: 100), () {
                // Clear the navigate stack and navigate to the login page
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  '/login', // The route name for your login page
                  (Route<dynamic> route) => false, // Remove all previous routes
                );
              });
            } else if (result == 'Profile') {
              // Navigate to the Profile page (adjust route as needed)
              Navigator.pushNamed(
                  context, '/profile'); // Uncomment and adjust as needed
            }
          },
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            const PopupMenuItem<String>(
              value: 'Profile',
              child: Text('Profile'),
            ),
            const PopupMenuItem<String>(
              value: 'Settings',
              child: Text('Settings'),
            ),
            const PopupMenuItem<String>(
              value: 'Logout',
              child: Text('Logout'),
            ),
          ],
        ),
      ],
    );
  }
}
