import 'package:flutter/material.dart';

class ErrorMessageScreen extends StatelessWidget {
  final String errorMessage;
  final String appBarTitle;

  const ErrorMessageScreen({
    super.key,
    required this.errorMessage, 
    required this.appBarTitle,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(appBarTitle),
          backgroundColor: Colors.red,
        ),

      body: Center(
        child: Center(
          child: Text(errorMessage, style: const TextStyle(fontSize: 30),)
        ),
      ),
    );
  }
}