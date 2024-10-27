import 'package:flutter/material.dart';

class DestinationTest extends StatefulWidget {
  @override
  _DestinationTestState createState() => _DestinationTestState();
}

class _DestinationTestState extends State<DestinationTest> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
  title: Text('Activity Details'),
  subtitle: Text('Tap to expand'),
  children: <Widget>[
    ListTile(
      title: Text('Location: New York'),
    ),
    ListTile(
      title: Text('Duration: 2 hours'),
    ),
    // Add more child widgets as needed
  ],
)
    );
  }
}
