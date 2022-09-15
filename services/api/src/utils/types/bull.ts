export declare enum DelayedJobs {
	HoldQuestion = 'HoldQuestion'
}

export declare type DelayedEvent = {
	type: DelayedJobs.HoldQuestion,
	data: { questionId: string, userId: string }
}
