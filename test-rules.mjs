import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { describe, it } from 'node:test';

async function runTest() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'demo-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });

  const alice = testEnv.authenticatedContext('alice', { email: 'alice@example.com' });

  try {
    await assertSucceeds(
      alice.firestore().doc('users/alice').set({
        uid: 'alice',
        email: 'alice@example.com',
        displayName: 'Itilizatè',
        grade_level: 'Not set',
        points: 0,
        badges: ['Nouvo Elèv'],
        streak_days: 0,
        last_active: new Date().toISOString(),
        homework_solved: 0
      })
    );
    console.log("Firestore rules allowed create!");
  } catch (error) {
    console.error("Firestore rules blocked create:", error);
  }

  await testEnv.cleanup();
}

runTest();
