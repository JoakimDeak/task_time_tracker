import { NextApiRequest, NextApiResponse } from 'next';
import connectToDb from 'dbConnect';
import { getSession } from 'next-auth/react';
import { Timer } from 'components/tracker/TrackerList';

interface UserData {
  _id: string;
  timers: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (req.method === 'GET') {
    const { db } = await connectToDb();
    const user = await db.collection('user').findOne({ _id: session?.userId });
    if (!user) {
      await db.collection<UserData>('user').insertOne({ _id: session?.userId as string, timers: [] });
    }
    const userTrackers = user?.trackers ?? [];
    const data = await db
      .collection('tracker')
      .find({ _id: { $in: userTrackers } })
      .toArray();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { db } = await connectToDb();

    const user = await db.collection('user').findOne({ _id: session?.userId });

    const updatedTrackers: Timer[] = req.body;
    const currentTrackers = await db
      .collection('tracker')
      .find({ _id: { $in: user?.trackers ?? [] } })
      .toArray();
    const deletedTrackers = currentTrackers.filter(
      (currentTracker) => !updatedTrackers.find((updatedTracker) => updatedTracker._id === currentTracker._id?.toString())
    );

    db.collection('user').updateOne({ _id: session?.userId }, { $set: { trackers: updatedTrackers.map((tracker) => tracker._id) } });

    updatedTrackers.forEach((tracker) => db.collection('tracker').replaceOne({ _id: tracker._id }, tracker, { upsert: true }));
    db.collection('tracker').deleteMany({ _id: { $in: deletedTrackers.map((tracker) => tracker.id) } });

    res.status(200).json({ message: 'Success' });
  }
}
