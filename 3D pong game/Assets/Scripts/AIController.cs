using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AIController : MonoBehaviour
{

    public Transform ball;
    public float upperBound = 7.5f;
    public float lowerBound = -7.5f;

    [Range(0, 1)]
    public float skill;

    // Update is called once per frame
    void Update()
    {
        Vector3 newPos = transform.position;
        newPos.x = Mathf.Lerp(transform.position.x, ball.position.x, skill);
        if(newPos.x <= upperBound & newPos.x >= lowerBound)
        {
            transform.position = newPos;
        }

    }
}
