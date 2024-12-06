import 'package:flutter/material.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:provider/provider.dart';

class NavigatorAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final bool? isHome;

  const NavigatorAppBar({
    super.key,
    this.title,
    this.isHome = false,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  void handleLogout(BuildContext context) {
    Provider.of<UserViewModel>(context, listen: false).logout();
    Provider.of<PlannerViewModel>(context, listen: false).logout();
    Provider.of<ShoppingListViewModel>(context, listen: false).logout();
    Provider.of<TodoListViewModel>(context, listen: false).logout();
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        title ?? '',
        style: const TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white, // Text color
        ),
      ),
      centerTitle: true, // Center-align the title
      backgroundColor: Colors.blueAccent, // Custom background color
      elevation: 6, // Adds shadow to the AppBar
      shadowColor: Colors.blue.shade200, // Shadow color
      leading: isHome == true
          ? Container()
          : IconButton(
              icon: const Icon(Icons.arrow_back_ios),
              onPressed: () {
                Navigator.pop(context);
              },
              tooltip: 'Back',
              color: Colors.white,
            ),
      actions: <Widget>[
        PopupMenuButton<String>(
          icon: const Icon(
            Icons.menu,
            color: Colors.white, // Icon color
          ),
          onSelected: (String result) {
            if (result == 'Logout') {
              handleLogout(context);

              Future.delayed(const Duration(milliseconds: 100), () {
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  '/login',
                  (route) => false,
                );
              });
            } else if (result == 'Profile') {
              Navigator.pushNamed(context, '/profile');
            }
          },
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            const PopupMenuItem<String>(
              value: 'Profile',
              child: ListTile(
                leading: Icon(Icons.person, color: Colors.blueAccent),
                title: Text('Profile'),
              ),
            ),
            const PopupMenuItem<String>(
              value: 'Settings',
              child: ListTile(
                leading: Icon(Icons.settings, color: Colors.blueAccent),
                title: Text('Settings'),
              ),
            ),
            const PopupMenuItem<String>(
              value: 'Logout',
              child: ListTile(
                leading: Icon(Icons.logout, color: Colors.redAccent),
                title: Text('Logout'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
