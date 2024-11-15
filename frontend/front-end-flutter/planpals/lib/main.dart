import 'package:flutter/material.dart';
import 'package:planpals/features/comment/comment_viewmodel.dart';
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/profile/views/login_page.dart';
import 'package:planpals/features/profile/views/signup_page.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/planners_view.dart';
import 'package:planpals/features/vote/vote_viewmodel.dart';
import 'package:provider/provider.dart';


void main() {
  runApp(

     MyApp()

  );
}

class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => PlannerViewModel()),
        ChangeNotifierProvider(create: (context) => UserViewModel()),
        ChangeNotifierProvider(create: (context) => VoteViewModel()),
        ChangeNotifierProvider(create: (context) => CommentViewModel()),
      ],

      child: SafeArea(
        child: GestureDetector(
          onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
          child: MaterialApp(
            title: 'Travel Planner',
            theme: ThemeData(
              primarySwatch: Colors.blue,
            ),
            initialRoute: '/login', // Set the initial route to login
            routes: {
              '/home': (context) => HomePage(),
              '/login': (context) => LoginPage(),
              '/signup': (context) => SignUpPage(),
              '/planners': (context) => const PlannersView(),
            },
          ),
        ),
      ),
    );
  }
}
