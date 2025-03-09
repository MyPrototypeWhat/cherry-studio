import { Transaction } from 'dexie'

/**
 * 为topics表添加自增序号字段sequence，用于排序
 */
export async function upgradeToV6(tx: Transaction): Promise<void> {
  const topics = await tx.table('topics').toArray()

  // 由于没有明确的创建时间字段，简单地按当前顺序分配递增序号
  const sortedTopics = topics.map((topic, index) => ({
    ...topic,
    sequence: index + 1 // 从1开始的序号
  }))

  // 更新现有topics记录
  for (const topic of sortedTopics) {
    await tx.table('topics').put(topic)
  }
}
