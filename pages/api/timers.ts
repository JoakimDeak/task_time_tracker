import { NextApiRequest, NextApiResponse } from 'next';
import connectToDb from 'dbConnect';
import { getSession } from 'next-auth/react';
import { Timer } from 'components/timer/TimerList';

interface UserData {
  _id: string;
  timers: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.userId) {
    res.status(500).json({ message: 'Missing userId' });
    return;
  }

  const { db } = await connectToDb();
  const user = await db.collection('user').findOne({ _id: session.userId });
  if (!user) {
    await db.collection<UserData>('user').insertOne({ _id: session.userId, timers: [] });
  }

  const currentTimers = await db
    .collection('timer')
    .find({ _id: { $in: user?.timers ?? [] } })
    .toArray();

  if (req.method === 'GET') {
    res.status(200).json(currentTimers);
  } else if (req.method === 'POST') {
    const updatedTimers: Timer[] = req.body;
    const deletedTimers = currentTimers.filter((currentTimer) => !updatedTimers.find((updatedTimer) => updatedTimer._id === currentTimer._id?.toString()));

    db.collection('user').updateOne({ _id: session?.userId }, { $set: { timers: updatedTimers.map((timer) => timer._id) } });

    updatedTimers.forEach((timer) => db.collection('timer').replaceOne({ _id: timer._id }, timer, { upsert: true }));
    db.collection('timer').deleteMany({ _id: { $in: deletedTimers.map((timer) => timer.id) } });

    res.status(200).json({ message: 'Success' });
  }
}
