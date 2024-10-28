import 'package:flutter/material.dart';

class CommentPage extends StatelessWidget {
  final List<Thread> threads = [
    Thread(
      title: 'Welcome to the Thread!',
      username: 'User1',
      content: 'Hello, this is my first message!',
    ),
    Thread(
      title: 'Discussion on Flutter',
      username: 'User2',
      content: 'I love building apps with Flutter!',
    ),
    Thread(
      title: 'Sharing Resources',
      username: 'User3',
      content: 'Check out this great Flutter tutorial!',
    ),
    // Add more threads as needed
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Thread Page'),
      ),
      body: ListView.builder(
        itemCount: threads.length,
        itemBuilder: (context, index) {
          return Card(
            margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    threads[index].title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    threads[index].username,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.blueAccent,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(threads[index].content),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class Thread {
  final String title;
  final String username;
  final String content;

  Thread({
    required this.title,
    required this.username,
    required this.content,
  });
}
